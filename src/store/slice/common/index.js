import { ACTION } from 'constant';

export const commonInitialState = {
  loading: false,
  data: null,
  selected: null,
  open: false,
  remove: false,
  isCreating: false,
  selectedID: '',
  deletedName: '',
  getSingleDetails: null,
  error: null,
  errorDetails: null,
  errorCreate: null,
  errorUpdate: null,
  errorDelete: null
};

export const commonReducers = {
  setDeletedName: (state, action) => {
    state.deletedName = action.payload;
  },
  setSelected: (state, action) => {
    state.selected = action.payload;
  },
  handleOpen: (state, action) => {
    const type = action.payload;
    console.log("VI = ",type);
    if (type === 'backdropClick') {
      state.selected = null;
      return;
    }
    if (type === ACTION.DELETE) {
      state.remove = true;
    } else if (type === ACTION.EDIT || type === ACTION.CREATE) {
      state.open = true;
      if (type === ACTION.CREATE) {
        state.isCreating = true;
      }
    }
  },
  handleClose: (state) => {
    state.remove = false;
    state.open = false;
    state.selected = null;
    state.isCreating = false;
    state.selectedID = '';
    state.getSingleDetails = null;
    state.deletedName = '';
  },
  setIsCreating: (state, action) => {
    state.isCreating = action.payload;
  },
  clearSingleDetails: (state) => {
    state.getSingleDetails = null;
  },
  setSelectedID: (state, action) => {
    state.selectedID = action.payload;
  },
  setGetSingleDetails: (state, action) => {
    state.getSingleDetails = action.payload;
  }
};
