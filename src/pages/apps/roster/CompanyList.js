import PropTypes from 'prop-types';
import { Fragment, useEffect, useState } from 'react';

// material-ui
import { Divider, List, ListItem, ListItemButton, ListItemText, Skeleton, Stack, Typography } from '@mui/material';

// project-imports
import { useSelector } from 'react-redux';
import axiosServices from 'utils/axios';

// ==============================|| CHAT - USER LIST ||============================== //

function CompanyList({ setCompany, search, selectedUser }) {
  const { companies, loading } = useSelector((state) => state.companies);
  // eslint-disable-next-line no-unused-vars
  const [data, setData] = useState([companies]);
console.log(companies)
  const [companySearchLoading, setCompanySearchLoading] = useState(false);

  const fetchCompanyListSearchAPi = async () => {
    setCompanySearchLoading(true);
    let data;
    try {
      const response = await axiosServices.get(`/company/getCompanyByName?filter=${search}&page=1&limit=10`);
      if (response.status === 200) {
        data = response.data.data.result;
      } else {
        data = [];
      }
      return data;
    } catch (err) {
      console.error(err);
    } finally {
      setCompanySearchLoading(false);
    }
  };
  useEffect(() => {
    if (search) {
      const searchResult = fetchCompanyListSearchAPi();
      setData(searchResult);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  if (companySearchLoading || loading)
    return (
      <List>
        {[1, 2, 3, 4, 5].map((index) => (
          <ListItem key={index} divider>
            <ListItemText
              primary={<Skeleton animation="wave" height={24} />}
              secondary={<Skeleton animation="wave" height={16} width="60%" />}
            />
          </ListItem>
        ))}
      </List>
    );
  return (
    <List component="nav">
      {companies.map((company) => (
        <Fragment key={company?._id}>
          <ListItemButton
            sx={{ pl: 1, borderRadius: 0, '&:hover': { borderRadius: 1 } }}
            onClick={() => {
              setCompany(company);
            }}
            selected={company?._id === selectedUser}
          >
            <ListItemText
              primary={
                <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                  <Typography
                    variant="subtitle1"
                    color="text.primary"
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {company?.company_name}
                  </Typography>
                  <Typography color="text.secondary" variant="caption">
                    {company?.state}
                  </Typography>
                </Stack>
              }
              secondary={
                <Typography
                  color="text.secondary"
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <>{company.company_email}</>
                </Typography>
              }
            />
          </ListItemButton>
          <Divider />
        </Fragment>
      ))}
    </List>
  );
}

CompanyList.propTypes = {
  setUser: PropTypes.func,
  search: PropTypes.string
};

export default CompanyList;
