import { Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import sign from './img/sign.png';

const { signatureContainer, signImage } = StyleSheet.create({
  signatureContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: '40px',
  },
  signImage: {
    position: 'absolute',
    width: '120px',
    left: '45%',
    top: '100%',
    transform: 'translate(-50%,-50%)',
  },
});

const CustomSignature = () => {
  return (
    <View style={signatureContainer}>
      <Text>Директор</Text>
      <Image src={sign} style={signImage} />
      <Text>Богдан Сидор</Text>
    </View>
  );
};

export default CustomSignature;
