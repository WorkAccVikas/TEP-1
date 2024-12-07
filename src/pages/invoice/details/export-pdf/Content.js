import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';

// third-party
import { Text, View, StyleSheet } from '@react-pdf/renderer';
import { useMemo } from 'react';

const textPrimary = '#262626';
const textSecondary = '#8c8c8c';
const border = '#f0f0f0';

// custom Style
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
    '@media max-width: 400': {
      paddingTop: 10,
      paddingLeft: 0
    }
  },
  card: {
    border: `1px solid ₹{border}`,
    borderRadius: '2px',
    padding: '20px',
    width: '48%'
  },
  title: {
    color: textPrimary,
    fontSize: '12px',
    fontWeight: 500
  },
  caption: {
    color: textSecondary,
    fontSize: '10px'
  },
  tableTitle: {
    color: textPrimary,
    fontSize: '10px',
    fontWeight: 500
  },
  tableCell: {
    color: textPrimary,
    fontSize: '10px'
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24
  },

  subRow: {
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    margin: 0,
    paddingBottom: 20
  },
  column: {
    flexDirection: 'column'
  },

  paragraph: {
    color: '#1F2937',
    fontSize: '12px'
  },

  tableHeader: {
    justifyContent: 'space-between',
    borderBottom: '1px solid #f0f0f0',
    borderTop: '1px solid #f0f0f0',
    paddingTop: '10px',
    paddingBottom: '10px',
    margin: 0,
    paddingLeft: 10
  },
  tableRow: {
    alignItems: 'center',
    justifyContent: 'center',
    borderBottom: '1px solid #f0f0f0',
    paddingBottom: 10,
    paddingTop: 10,
    margin: 0,
    paddingLeft: 10
  },
  amountSection: { margin: 0, paddingRight: 25, paddingTop: 16, justifyContent: 'flex-end' },
  amountRow: { margin: 0, width: '40%', justifyContent: 'space-between' },
  pb5: { paddingBottom: 5 },
  flex03: { flex: '0.3 1 0px' },
  flex07: { flex: '0.7 1 0px' },
  flex17: { flex: '1.7 1 0px' },
  flex20: { flex: '2 1 0px' }
});

const Content = ({ list }) => {
  const theme = useTheme();

  const subTotal = useMemo(() => {
    return list?.invoiceData.reduce((acc, curr) => acc + Number(curr.amount), 0);
  }, [list?.invoiceData]);
  console.log(`🚀 ~ subTotal ~ subTotal:`, subTotal);

  const tax = useMemo(() => {
    return list?.invoiceData.reduce((acc, curr) => acc + Number(curr.Tax_amount), 0);
  }, [list?.invoiceData]);

  const discount = useMemo(() => {
    return list?.invoiceData.reduce((acc, curr) => acc + Number(curr.discount), 0);
  }, [list?.invoiceData]);

  const grandTotalAmount = useMemo(() => {
    return subTotal - discount + tax;
  }, [subTotal, discount, tax]);

  return (
    <>
      <View style={styles.container}>
        <View style={[styles.row, styles.subRow]}>
          {/* From */}
          <View style={styles.card}>
            <Text style={[styles.title, { marginBottom: 8 }]}>From:</Text>
            <Text style={[styles.caption, styles.pb5]}>{list?.billedBy?.cabProviderLegalName}</Text>
            <Text style={[styles.caption, styles.pb5]}>{list?.billedBy?.contactPersonName}</Text>
            <Text style={[styles.caption, styles.pb5]}>{list?.billedBy?.workEmail}</Text>
            <Text style={[styles.caption, styles.pb5]}>{list?.billedBy?.workMobileNumber}</Text>
            <Text style={[styles.caption, styles.pb5]}>{list?.billedBy?.officeAddress}</Text>
            <Text style={[styles.caption, styles.pb5]}>{list?.billedBy?.officePinCode}</Text>
            <Text style={[styles.caption, styles.pb5]}>{list?.billedBy?.officeState}</Text>
            <Text style={[styles.caption, styles.pb5]}>{list?.billedBy?.PAN}</Text>
            <Text style={[styles.caption, styles.pb5]}>{list?.billedBy?.GSTIN}</Text>
          </View>

          {/* To */}
          <View style={styles.card}>
            <Text style={[styles.title, { marginBottom: 8 }]}>To:</Text>
            <Text style={[styles.caption, styles.pb5]}>{list?.billedTo?.company_name}</Text>
            <Text style={[styles.caption, styles.pb5]}>{list?.billedTo?.contact_person}</Text>
            <Text style={[styles.caption, styles.pb5]}>{list?.billedTo?.company_email}</Text>
            <Text style={[styles.caption, styles.pb5]}>{list?.billedTo?.mobile}</Text>
            <Text style={[styles.caption, styles.pb5]}>{list?.billedTo?.PAN}</Text>
            <Text style={[styles.caption, styles.pb5]}>{list?.billedTo?.GSTIN}</Text>
            <Text style={[styles.caption, styles.pb5]}>{list?.billedTo?.postal_code}</Text>
            <Text style={[styles.caption, styles.pb5]}>{list?.billedTo?.address}</Text>
            <Text style={[styles.caption, styles.pb5]}>{list?.billedTo?.state}</Text>
          </View>
        </View>

        <View>
          <View style={[styles.row, styles.tableHeader, { backgroundColor: theme.palette.secondary[100] }]}>
            <Text style={[styles.tableTitle, styles.flex03]}>#</Text>
            <Text style={[styles.tableTitle, styles.flex17]}>ITEM NAME</Text>
            <Text style={[styles.tableTitle, styles.flex07]}>RATE</Text>
            <Text style={[styles.tableTitle, styles.flex07]}>QUANTITY</Text>
            <Text style={[styles.tableTitle, styles.flex07]}>TAX</Text>
            <Text style={[styles.tableTitle, styles.flex07]}>DISCOUNT</Text>
            <Text style={[styles.tableTitle, styles.flex07]}>AMOUNT</Text>
          </View>

          {list?.invoiceData.map((row, index) => {
            return (
              <View style={[styles.row, styles.tableRow]} key={row.id}>
                <Text style={[styles.tableCell, styles.flex03]}>{index + 1}</Text>
                <Text style={[styles.tableCell, styles.flex17, { textOverflow: 'ellipsis' }]}>{row.itemName}</Text>
                <Text style={[styles.tableCell, styles.flex07]}>{row.rate}</Text>
                <Text style={[styles.tableCell, styles.flex07]}>{row.quantity}</Text>
                <Text style={[styles.tableCell, styles.flex07]}>{row.Tax_amount}</Text>
                <Text style={[styles.tableCell, styles.flex07]}>{row.discount}</Text>
                <Text style={[styles.tableCell, styles.flex07]}>{row.amount}</Text>
              </View>
            );
          })}
        </View>

        <View style={[styles.row, { paddingTop: 25, margin: 0, paddingRight: 25, justifyContent: 'flex-end' }]}>
          <View style={[styles.row, styles.amountRow]}>
            <Text style={styles.caption}>Sub Total:</Text>
            <Text style={styles.tableCell}>
              {`$`} {subTotal?.toFixed(2)}
            </Text>
          </View>
        </View>
        <View style={[styles.row, styles.amountSection]}>
          <View style={[styles.row, styles.amountRow]}>
            <Text style={styles.caption}>Discount:</Text>
            <Text style={[styles.caption, { color: theme.palette.success.main }]}>
              {`$`} {discount?.toFixed(2)}
            </Text>
          </View>
        </View>
        <View style={[styles.row, styles.amountSection]}>
          <View style={[styles.row, styles.amountRow]}>
            <Text style={styles.caption}>Tax:</Text>
            <Text style={[styles.caption]}>
              {`$`} {tax?.toFixed(2)}
            </Text>
          </View>
        </View>
        <View style={[styles.row, styles.amountSection]}>
          <View style={[styles.row, styles.amountRow]}>
            <Text style={styles.tableCell}>Grand Total:</Text>
            <Text style={styles.tableCell}>
              {`$`} {grandTotalAmount?.toFixed(2)}
            </Text>
          </View>
        </View>
        <View style={[styles.row, { alignItems: 'flex-start', marginTop: 20, width: '95%' }]}>
          <Text style={styles.caption}>Notes </Text>
          <Text style={styles.tableCell}> It was a pleasure working with you and your team.</Text>
        </View>
      </View>
    </>
  );
};

Content.propTypes = {
  list: PropTypes.object
};

export default Content;
