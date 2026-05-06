import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, Image, Font } from '@react-pdf/renderer';
Font.register({
  family: 'Anuphan',
  src: '../../../../../../../font/Anuphan-VariableFont_wght.ttf',
});

export const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    fontFamily: 'Anuphan'
  },
  section: {
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
    padding: 0,
    margin: 0,
    width: '100%',
    height: '100%',
    objectFit: 'fit',
  },
});