import { Text, View, StyleSheet } from '@react-pdf/renderer';

const { textIndent, hugeMarginBottom } = StyleSheet.create({
  textIndent: {
    textIndent: '20px',
    textAlign: 'justify'
  },
  hugeMarginBottom: {
    marginBottom: '5px'
  }
});

const BodyPDFTransaction = ({
  contractNumber,
  contractDate,
  businessName,
  createOn,
  amount,
  pan,
  tranId,
  uuid
}) => {
  return (
    <View>
      <Text style={[textIndent, hugeMarginBottom]}>
        ТОВ «ПЕЙТЕК УКРАЇНА» (код ЄДРПОУ 44103264) надає послуги з переказу
        коштів в національній валюті без відкриття рахунків.
      </Text>
      <Text style={[textIndent, hugeMarginBottom]}>
        Для цього Товариство внесене в державний реєстр фінансових установ
        (Свідоцтво про реєстрацію фінансової установи від 27.08.2021 серії ФК №
        В0000338, Ліцензія Національного банку України на переказ коштів у
        національній валюті без відкриття рахунків від 26.11.2021 року).
      </Text>
      <Text style={[textIndent, hugeMarginBottom]}>
        Між нашими Товариствами було укладено Договір про організацію переказу
        грошових коштів №{contractNumber} від {contractDate}.
      </Text>
      <Text style={[textIndent, hugeMarginBottom]}>
        Відповідно до зазначеного Договору було успішно перераховано кошти на
        платіжну картку клієнта від ТОВ «{businessName}»:
      </Text>
      <Text style={[textIndent]}>
        {createOn} на суму {amount} грн, маска картки {pan}, номер транзакції в
        системі ТОВ «ПЕЙТЕК УКРАЇНА» – {tranId}, номер транзакції в системі ТОВ
        «АВЕНТУС УКРАЇНА» - {uuid}, призначення платежу: зарахування на карту
        {pan}.
      </Text>
    </View>
  );
};

export default BodyPDFTransaction;
