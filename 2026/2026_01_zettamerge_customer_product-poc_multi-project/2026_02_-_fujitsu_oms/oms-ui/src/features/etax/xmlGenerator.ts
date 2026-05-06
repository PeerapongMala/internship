import dayjs from 'dayjs';
import type { Order } from '../../types';

export function generateInvoiceNumber(): string {
  const date = dayjs().format('YYYYMMDD');
  const rand = String(Math.floor(Math.random() * 9000) + 1000);
  return `INV-${date}-${rand}`;
}

export function generateTaxXml(order: Order, invoiceNumber: string): string {
  const now = dayjs();
  const vat = Math.round(order.totalAmount * 0.07);
  const beforeVat = order.totalAmount - vat;

  const itemsXml = order.items
    .map(
      (item, i) => `    <Item lineNumber="${i + 1}">
      <SKU>${item.sku}</SKU>
      <Description>${item.name}</Description>
      <Quantity>${item.qty}</Quantity>
      <UnitPrice>${item.price.toFixed(2)}</UnitPrice>
      <Amount>${(item.qty * item.price).toFixed(2)}</Amount>
    </Item>`,
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<TaxInvoice xmlns="urn:th:gov:rd:etax:taxinvoice:v1">
  <Header>
    <InvoiceNumber>${invoiceNumber}</InvoiceNumber>
    <InvoiceDate>${now.format('YYYY-MM-DD')}</InvoiceDate>
    <InvoiceTime>${now.format('HH:mm:ss')}</InvoiceTime>
    <Purpose>TIVC01</Purpose>
  </Header>
  <Seller>
    <TaxID>0105500000001</TaxID>
    <Name>บริษัท ฟูจิตสึ (ประเทศไทย) จำกัด</Name>
    <BranchID>${order.branch}</BranchID>
    <Address>1 ถ.วิทยุ แขวงลุมพินี เขตปทุมวัน กรุงเทพฯ 10330</Address>
  </Seller>
  <Buyer>
    <Name>${order.customer.name}</Name>
    <Phone>${order.customer.phone}</Phone>
    <Address>${order.customer.address}</Address>
  </Buyer>
  <OrderReference>${order.orderNumber}</OrderReference>
  <Items>
${itemsXml}
  </Items>
  <Summary>
    <SubTotal>${beforeVat.toFixed(2)}</SubTotal>
    <VATRate>7.00</VATRate>
    <VATAmount>${vat.toFixed(2)}</VATAmount>
    <GrandTotal>${order.totalAmount.toFixed(2)}</GrandTotal>
  </Summary>
</TaxInvoice>`;
}
