import React from 'react';
import {
  Page,
  View,
  Document,
  StyleSheet,
  Font,
  Image,
} from '@react-pdf/renderer';
import colonticul from './img/colonticul.jpg';
import CustomPDFHeader from './CustomPDFHeader';
import CustomSignature from './CustomSignature';

Font.register({
  family: 'Roboto',
  src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf',
});

Font.registerHyphenationCallback((word) => [word]);

const styles = StyleSheet.create({
  document: {},
  page: {
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'Roboto',
    fontSize: '12px',
    fontWeight: 'normal',
  },
  container: {
    marginTop: '75.8px',
    marginRight: '57px',
    marginBottom: '75.8px',
    marginLeft: '114px',
  },
  'img-container': {
    position: 'absolute',
    top: '-50px',
  },
  img: {
    width: '100%',
    objectFit: 'contain',
  },
});

const CustomPDFLayout = ({
  children,
  docNumber,
  contractDate,
  businessName,
}) => {
  return (
    <Document style={styles.document}>
      <Page syze="A4" style={styles.page}>
        <View style={styles.container}>
          <View style={styles['img-container']}>
            <Image src={colonticul} style={styles.img} />
          </View>
          <CustomPDFHeader
            docNumber={docNumber}
            contractDate={contractDate}
            businessName={businessName}
          />
          {children}
          <CustomSignature />
        </View>
      </Page>
    </Document>
  );
};

export default CustomPDFLayout;
