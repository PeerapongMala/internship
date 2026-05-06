import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
  Image,
  Font,
} from '@react-pdf/renderer';
Font.register({
  family: 'Anuphan',
  src: '../../../../../../../font/Anuphan-VariableFont_wght.ttf',
});

export const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    padding: 20,
    backgroundColor: '#ffffff',
    fontFamily: 'Anuphan',
  },
  section: {
    marginBottom: 20,
    fontFamily: 'Anuphan',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 10,
    fontFamily: 'Anuphan',
  },
  bottomHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
    fontFamily: 'Anuphan',
    alignItems: 'flex-start',
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
    fontFamily: 'Anuphan',
  },
  image: {
    width: 550,
    height: 800,
    objectFit: 'fit',
    marginBottom: 10,
  },
  textBold: {
    fontWeight: 'bold',
  },
  logo: {
    width: 100,
    height: 100,
    objectFit: 'fit',
    marginBottom: 10,
    position: 'absolute',
    top: -30,
    right: 15,
  },
  table: {
    width: '100%',
    borderColor: '1px solid #f3f4f6',
    margin: '20px 0',
    fontSize: 8,
    textAlign: 'center',
    tableLayout: 'fixed',
  },
  tableHeader: {
    backgroundColor: '#e5e5e5',
    fontSize: 10,
  },
  td: {
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },

  heightTable: {
    minHeight: 50,
  },
  totalRow: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  nameWidht: {
    width: 200,
  },
});

import { Invoice } from '../../../../../domain/g02/g02-d01/local/type';
import ThaiBahtText from 'thai-baht-text';
import logoPKK from '@asset/Logo/Logo_TSR_Light.png';
import FinanceSignature from '@asset/signature/finance-signature.png';
import { Table, TD, TH, TR } from '@ag-media/react-pdf-table';
import { toDateTH } from '@global/helper/uh-date-time';

export interface UnifiedInvoicePDFProps {
  invoiceListData: Invoice;
  priceData: {
    price_per_page: number;
    discount: number;
    base_price_per_page: number;
    vat_tax: number;
    ad_tax: number;
  };
  type: 'billing' | 'receipt'; // ประเภทเอกสาร
}

export default function UnifiedInvoicePDF({
  invoiceListData,
  priceData,
  type,
}: UnifiedInvoicePDFProps) {
  const isTaxInvoice = invoiceListData.vat_tax > 0;
  {
  }
  console.log(invoiceListData);

  const taxInvoice =
    ((invoiceListData.price +
      0.02 * invoiceListData.base_price -
      invoiceListData.base_price) /
      invoiceListData.base_price) *
    100;
  console.log(taxInvoice);

  const basePrice = invoiceListData.base_price;
  const price = invoiceListData.price;
  const isWithholding = basePrice >= 1000;

  const vatPercent = isWithholding
    ? ((price + 0.02 * basePrice - basePrice) / basePrice) * 100
    : ((price - basePrice) / basePrice) * 100;

  const vatAmount = isWithholding
    ? price + 0.02 * basePrice - basePrice
    : price - basePrice;

  const withholdingAmount = isWithholding ? basePrice * 0.02 : 0;

  const renderTitle = (copy: boolean) => {
    if (type !== 'billing' && type !== 'receipt') return null;
    return (
      <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 60 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 15 }}>
          {type === 'billing'
            ? 'ใบวางบิล / ใบแจ้งหนี้'
            : isTaxInvoice
              ? 'ใบเสร็จรับเงิน / ใบกำกับภาษี'
              : 'ใบเสร็จรับเงิน'}

          {`   `}
        </Text>
        <Text style={{ fontWeight: 'bold', fontSize: 14 }}>
          {type === 'billing'
            ? 'Billing Note / Invoice'
            : isTaxInvoice
              ? 'Receipt / Tax Invoice'
              : 'Receipt'}

          {`   `}
        </Text>
        <Text>
          {copy ? '(สำเนา) ' : '(ต้นฉบับ) '}

          {`   `}
        </Text>
      </View>
    );
  };

  const renderPage = (copy: boolean) => (
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ lineHeight: 1, marginTop: 50 }}>
          <Text>บริษัท ประกาศข่าวดี จำกัด{`   `}</Text>
          <Text>เลขที่ 74/72 ถนนเสนานิคม 1 (หมู่บ้านเสนานิเวศน์โครงการ 1){`   `}</Text>
          <Text>แขวงจรเข้บัว เขตลาดพร้าว กรุงเทพมหานคร 10230{`   `}</Text>
          <Text>เลขประจำตัวผู้เสียภาษี 0105568017572 สาขา สำนักงานใหญ่{`   `}</Text>
        </View>
        <View style={{ textAlign: 'center' }}>
          <Image style={styles.logo} src={logoPKK} />
          {renderTitle(copy)}
        </View>
      </View>

      {/* Customer Info */}
      <View style={styles.bottomHeader}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}>
          <View style={{ lineHeight: 1 }}>
            <Text>ชื่อผู้ซื้อ{`   `}</Text>
            <Text>ที่อยู่{`   `}</Text>
          </View>
          <View style={{ lineHeight: 1 }}>
            <Text>
              {invoiceListData.company
                ? `บริษัท ${invoiceListData.company} จำกัด`
                : `${invoiceListData.first_name} ${invoiceListData.last_name}`}
              {`   `}
            </Text>
            <Text>
              {`เลขที่ ${invoiceListData.address || '-'}`}
              {`   `}
            </Text>
            <Text>
              {`แขวง/ตำบล ${invoiceListData.district || '-'} เขต ${invoiceListData.sub_district || '-'}`}
              {`   `}
            </Text>
            <Text>
              {`จังหวัด ${invoiceListData.province || '-'} รหัสไปรษณีย์ ${invoiceListData.postal_code || '-'}`}
              {`   `}
            </Text>
            <Text>
              {`เลขประจำตัวผู้เสียภาษี ${invoiceListData.tax_id || '-'}`}
              {invoiceListData.branch ? ` สาขา ${invoiceListData.branch}` : ''}
              {`   `}
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}>
          <View style={{ lineHeight: 1 }}>
            <Text>เลขที่{`   `}</Text>
            <Text>วันที่{`   `}</Text>
            {type === 'billing' && <Text>วันครบกำหนด{`   `}</Text>}
            <Text>
              อัตราภาษี {Math.round(vatPercent)}%{`   `}
            </Text>
          </View>
          <View style={{ lineHeight: 1 }}>
            <Text>
              {invoiceListData.announcement_no}
              {`   `}
            </Text>
            <Text>
              {toDateTH(invoiceListData.order_date)}
              {`   `}
            </Text>
            {type === 'billing' && (
              <Text>
                {toDateTH(invoiceListData.order_date)}
                {`   `}
              </Text>
            )}
          </View>
        </View>
      </View>

      {/* Table */}
      <Table style={[styles.table, styles.heightTable]}>
        <TH style={[styles.tableHeader, styles.textBold]}>
          <TD style={styles.td}>ลำดับ </TD>
          <TD style={styles.td}>รายการ </TD>
          <TD style={styles.td}>จำนวนหน่วย </TD>
          <TD style={styles.td}>ราคาต่อหน่วย </TD>
          <TD style={styles.td}>จำนวนเงิน </TD>
        </TH>
        <TR>
          <TD style={styles.td}>1 </TD>
          <TD style={styles.td}>ค่าประกาศหนังสือพิมพ์ </TD>
          <TD style={styles.td}>{invoiceListData.image_url_list.length} </TD>
          <TD style={styles.td}>
            {(basePrice / invoiceListData.image_url_list.length).toFixed(2)}
          </TD>
          <TD style={styles.td}>{basePrice.toFixed(2)}</TD>
        </TR>
      </Table>

      {/* Totals */}
      <View
        style={[
          styles.totalRow,
          {
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            gap: 50,
            paddingRight: 0,
          },
        ]}
      >
        <View style={{ lineHeight: 1 }}>
          <Text style={styles.totalRow}>จำนวนเงินก่อนภาษี{`   `}</Text>
          <Text style={styles.totalRow}>
            ภาษีมูลค่าเพิ่ม {Math.round(vatPercent)}%{`   `}
          </Text>
          {isWithholding && (
            <Text style={styles.totalRow}>หักภาษี ณ ที่จ่าย 2%{`   `}</Text>
          )}
          <Text style={styles.totalRow}>ยอดรวม{`   `}</Text>
        </View>
        <View style={{ lineHeight: 1, alignItems: 'flex-end' }}>
          <Text style={styles.totalRow}>
            {basePrice.toFixed(2)}
            {`   `}
          </Text>
          <Text style={styles.totalRow}>
            {vatAmount.toFixed(2)}
            {`   `}
          </Text>
          {isWithholding && (
            <Text style={styles.totalRow}>
              {withholdingAmount.toFixed(2)}
              {`   `}
            </Text>
          )}
          <Text style={styles.totalRow}>
            {price.toFixed(2)}
            {`   `}
          </Text>
        </View>
      </View>

      {/* Thai Baht Text */}
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          marginTop: 10,
          justifyContent: 'flex-start',
          gap: 30,
          paddingLeft: 205,
        }}
      >
        <Text style={styles.totalRow}>จำนวนเงินรวมทั้งสิ้น (ตัวอักษร):{`   `}</Text>
        <Text style={[styles.totalRow, { textAlign: 'center', width: '100%' }]}>
          {ThaiBahtText(price)}
          {`   `}
        </Text>
      </View>

      {/* Signatures */}
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          fontSize: 10,
          fontWeight: 'bold',
          marginTop: 200,
          fontFamily: 'Anuphan',
          alignItems: 'flex-start',
        }}
      >
        <View style={{ alignItems: 'center' }}>
          <Text style={{ marginBottom: 15 }}>
            ลงชื่อ ...................................... ผู้รับ
            {`   `}
          </Text>
          <Text>วันที่ ....................................{`   `}</Text>
        </View>

        <View style={{ alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
            <Text>
              ลงชื่อ{'                                        '}ผู้ขาย{`   `}
            </Text>
            <Image
              style={{
                position: 'absolute',
                right: 13,
                width: 90,
                height: 50,
                marginHorizontal: 10,
              }}
              src={FinanceSignature}
            />
          </View>
          <Text>
            วันที่ {toDateTH(invoiceListData?.order_date)}
            {`   `}
          </Text>
        </View>
      </View>
    </Page>
  );

  return (
    <Document>
      {renderPage(false)} {/* ต้นฉบับ */}
      {renderPage(true)} {/* สำเนา */}
    </Document>
  );
}
