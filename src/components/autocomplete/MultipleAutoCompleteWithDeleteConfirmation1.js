/* eslint-disable no-unused-vars */
import { Autocomplete, TextField } from '@mui/material';
import ConfirmationDialog from 'components/alertDialog/ConfirmationDialog';
import { useFormikContext } from 'formik';
import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';

export const DELETE_ACTIONS = {
  DELETE_ONE: 'DELETE_ONE',
  DELETE_ALL: 'DELETE_ALL'
};

const MultipleAutoCompleteWithDeleteConfirmation1 = ({
  id,
  options, // To get options
  getOptionLabel, // To get option label
  placeholder = 'Select options',
  onChange,
  saveToFun,
  matchID, // To match id from options array we passed
  displayDeletedKeyName, // To display deleted key name (single delete) in delete confirmation
  disableConfirmation = false, // To disable all delete confirmation for single delete and all delete
  deleteAllMessage = 'selected',
  ...props
}) => {
  const { setFieldValue, touched, errors, values } = useFormikContext();

  const [open, setOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleteAction, setDeleteAction] = useState(null);
  const [value, setValue] = useState(options);

  const handleDelete = useCallback((option, action) => {
    setPendingDelete(option);
    setDeleteAction(action);
    setOpen(true);
  }, []);

  const handleClose = useCallback(
    (e, confirmed) => {
      if (confirmed) {
        if (deleteAction === DELETE_ACTIONS.DELETE_ONE && pendingDelete) {
          setValue((prev) => prev.filter((v) => v[matchID] !== pendingDelete[matchID]));
          const updatedValue = value.filter((v) => v[matchID] !== pendingDelete[matchID]);
          saveToFun(e, updatedValue, _, DELETE_ACTIONS.DELETE_ONE);
        } else if (deleteAction === DELETE_ACTIONS.DELETE_ALL) {
          setValue([]);
          saveToFun(e, [], _, DELETE_ACTIONS.DELETE_ALL);
        }
      }
      setOpen(false);
      setPendingDelete(null);
      setDeleteAction(null);
    },
    [pendingDelete, deleteAction, saveToFun, matchID, value]
  );

  const handleOnChange = useCallback(
    (event, newValue, reason, details) => {
      if (reason === 'removeOption') {
        event.preventDefault();
        handleDelete(details.option, DELETE_ACTIONS.DELETE_ONE);
      } else if (reason === 'clear') {
        event.preventDefault();
        handleDelete(null, DELETE_ACTIONS.DELETE_ALL);
      } else {
        setValue(newValue);
        saveToFun(event, newValue, values.rateData);
      }
    },
    [handleDelete, values, saveToFun]
  );

  return (
    <>
      <Autocomplete
        multiple
        id={id}
        options={options}
        getOptionLabel={getOptionLabel}
        filterSelectedOptions
        // value={!disableConfirmation ? value : undefined}
        onChange={!disableConfirmation ? handleOnChange : onChange}
        isOptionEqualToValue={(option, value) => {
          return option[matchID] === value[matchID];
        }}
        renderInput={(params) => <TextField {...params} placeholder={placeholder} />}
        sx={{
          '& .MuiOutlinedInput-root': {
            p: 1
          },
          '& .MuiAutocomplete-tag': {
            bgcolor: 'primary.lighter',
            border: '1px solid',
            borderColor: 'primary.light',
            '& .MuiSvgIcon-root': {
              color: 'primary.main',
              '&:hover': {
                color: 'primary.dark'
              }
            }
          }
        }}
        {...props}
      />

      <ConfirmationDialog
        open={open}
        title="Confirm Deletion"
        content={`Are you sure you want to delete ${
          deleteAction === DELETE_ACTIONS.DELETE_ALL ? `all ${deleteAllMessage} options` : `"${pendingDelete?.[displayDeletedKeyName]}"`
        }?`}
        onClose={handleClose}
      />
    </>
  );
};

MultipleAutoCompleteWithDeleteConfirmation1.propTypes = {
  id: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  getOptionLabel: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  saveToFun: PropTypes.func,
  matchID: PropTypes.string,
  displayDeletedKeyName: PropTypes.string,
  disableConfirmation: PropTypes.bool,
  deleteAllMessage: PropTypes.string
};

export default MultipleAutoCompleteWithDeleteConfirmation1;

/** DESC :
 *  CASE 1 : When you want to open confirmation dialog when we delete single option delete & all options from the list of AutoComplete
 *  props pass (mandatory) :
 *      - saveToFun : function
 *      - matchID : string of key name to match the deleted item
 *      - displayDeletedKeyName : string of key name to display the deleted item of dialog
 *
 * props pass (optional) :
 *      - deleteAllMessage : string
 *
 *  CASE 2 : When you don't want to dialog when we delete single option delete & all options from the list of AutoComplete
 *  props pass (mandatory) :
 *      - onChange : function
 *      - disableConfirmation : boolean
 */
