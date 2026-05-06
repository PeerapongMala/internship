import { Document, Page, Text, View, Image, StyleSheet, Font } from '@react-pdf/renderer';
Font.register({
  family: 'THSarabun',
  fonts: [
    {
      src: '/font/THSarabun/SarabunRegular.ttf',
      fontWeight: 400,
    },
    {
      src: '/font/THSarabun/SarabunBold.ttf',
      fontWeight: 700,
    },
  ],
});

export const styles = StyleSheet.create({
  page: {
    fontFamily: 'THSarabun',
    fontSize: 12,
    padding: 20,
    width: '210mm',
    minHeight: '297mm',
  },
  container: {
    flex: 1,
  },
  headerContainer: {
    marginBottom: 8,
    padding: 10,
    position: 'relative',
  },
  header: {
    textAlign: 'center',
    marginBottom: 5,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    marginBottom: 2,
  },
  studentInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    paddingHorizontal: 60,
  },
  studentInfoLeft: {
    flexDirection: 'row',
    gap: 20,
  },
  studentInfoRight: {
    flexDirection: 'row',
    gap: 20,
  },
  backgroundImage: {
    position: 'absolute',
    top: 120,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.05,
  },
  logoImage: {
    position: 'absolute',
    top: 18,
    left: 28,
    right: 0,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  table: {
    width: '100%',
    marginBottom: 5,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderStyle: 'solid',
  },
  tableRow: {
    flexDirection: 'row',
    minHeight: 24,
  },
  modifiedTableRowHeader: {
    flexDirection: 'row',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    minHeight: 24,
    alignItems: 'center',
    marginLeft: '5%', // Added margin to accommodate vertical column
  },
  tableCellHeader: {
    borderColor: 'black',
    borderWidth: 1,
    padding: 4,
    textAlign: 'center',
    height: '100%',
    fontWeight: 700,
  },
  headerText: {
    textAlign: 'center',
    fontSize: 12,
  },
  rotatedCellContainer: {
    width: '4%',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#d1d5db',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
  },
  rotatedText: {
    position: 'absolute',
    top: 75,
    transform: 'rotate(-90deg)',
    fontWeight: 'bold',
    width: 150,
    textAlign: 'center',
  },
  tableCell: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#d1d5db',
    padding: 2,
    fontSize: 10,
    justifyContent: 'center',
  },
  tableHeader: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  contentContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  leftColumn: {
    flex: 1,
    marginRight: 16,
  },
  rightColumn: {
    flex: 1,
    alignItems: 'center',
    gap: 24,
  },
  summaryTable: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    marginBottom: 5,
  },
  summaryRow: {
    flexDirection: 'row',
    minHeight: 18,
  },
  summaryCell: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    paddingHorizontal: 1,
    fontSize: 10,
  },
  signatureBox: {
    alignItems: 'center',
    width: '100%',
  },
  signatureLine: {
    width: 150,
    borderBottomWidth: 1,
    borderBottomStyle: 'dotted',
    borderBottomColor: '#d1d5db',
    marginVertical: 4,
  },
  signatureLineFree: {
    height: 1,
    borderBottomWidth: 1,
    borderBottomStyle: 'dotted',
    borderBottomColor: '#d1d5db',
  },
});
