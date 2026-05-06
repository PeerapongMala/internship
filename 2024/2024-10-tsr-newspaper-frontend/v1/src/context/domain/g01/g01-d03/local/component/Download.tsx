import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, Image, Font } from '@react-pdf/renderer';
Font.register({
  family: 'Anuphan',
  src: '../../../../../../../font/Anuphan-VariableFont_wght.ttf',
});

export const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    padding: 20,
    backgroundColor: '#ffffff',
    fontFamily: 'Anuphan'

  },
  section: {
    marginBottom: 20,
    fontFamily: 'Anuphan',
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 10,
    fontFamily: 'Anuphan',
  },
  bottomHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
    fontFamily: 'Anuphan',
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
    fontFamily: 'Anuphan',
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: 'fit',
    marginBottom: 10,
  },
  textBold: {
    fontWeight: 'bold'
  },
  logo:{
    width: 100,
    height: 100,
    objectFit: 'fit',
    marginBottom: 10,

  },
  table: {
    width: "100%",
    height: 400,
    borderColor: "1px solid #f3f4f6",
    margin: "20px 0",
    fontSize: 8,
    textAlign: 'center',
    tableLayout: 'fixed',
  },
  tableHeader: {
    backgroundColor: "#e5e5e5",
    fontSize: 10,

  },
  td: {
    padding: 6,
    justifyContent: 'center',
    alignItems:'center'
  },

  heightTable: {
    minHeight: 50,
    
  },
  totalRow: {
    backgroundColor: '#e5e5e5',
    fontSize: 10,
    fontWeight: 'bold',
  },
  nameWidht:{
    width: 200
  }
});