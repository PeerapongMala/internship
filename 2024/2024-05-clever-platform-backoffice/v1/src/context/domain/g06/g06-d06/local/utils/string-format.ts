export class StringFormat {
  static Fullname = (title?: string, firstName?: string, lastName?: string) => {
    if (!title && !firstName && !lastName) return '-';
    return `${title || ''} ${firstName || ''} ${lastName || ''}`.trim();
  };

  static Address = (
    addressNo?: string,
    addressMoo?: string,
    addressSubDistrict?: string,
    addressDistrict?: string,
    addressProvince?: string,
    addressPostalCode?: string,
  ) => {
    if (
      !addressNo &&
      !addressMoo &&
      !addressSubDistrict &&
      !addressDistrict &&
      !addressProvince &&
      !addressPostalCode
    ) {
      return '-';
    }

    let addressParts = [];

    // Add house number
    if (addressNo) {
      addressParts.push(`บ้านเลขที่ ${addressNo}`);
    }

    // Add village number (moo)
    if (addressMoo) {
      addressParts.push(`หมู่ ${addressMoo}`);
    }

    // Add sub-district (tambon)
    if (addressSubDistrict) {
      addressParts.push(addressSubDistrict);
    }

    // Add district (amphoe)
    if (addressDistrict) {
      addressParts.push(addressDistrict);
    }

    // Add province
    if (addressProvince) {
      addressParts.push(addressProvince);
    }

    // Add postal code
    if (addressPostalCode) {
      addressParts.push(addressPostalCode);
    }

    return addressParts.length > 0 ? addressParts.join(' ') : '-';
  };
}
