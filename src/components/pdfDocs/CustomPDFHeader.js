import { Text, View, StyleSheet } from '@react-pdf/renderer';

const { head, alignEnd, alignCenter, hugeMarginBottom } = StyleSheet.create({
  head: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    fontSize: '11px',
  },
  alignEnd: {
    alignSelf: 'flex-end',
  },
  alignCenter: {
    alignSelf: 'center',
  },
  hugeMarginBottom: {
    marginBottom: '50px',
  },
});

const CustomPDFHeader = ({ docNumber, contractDate, businessName }) => {
  return (
    <View style={head}>
      <Text>{`Вих. № ${docNumber}`}</Text>
      <Text>Від {contractDate} </Text>
      <Text style={[alignEnd, hugeMarginBottom]}>ТОВ «{businessName}» </Text>
      <Text style={[alignCenter, { marginBottom: '15px' }]}>
        Шановні партнери!
      </Text>
      <Text style={[alignCenter, { marginBottom: '15px' }]}>
        Цим листом виражаємо Вам нашу повагу та повідомляємо наступне:
      </Text>
    </View>
  );
};

export default CustomPDFHeader;
