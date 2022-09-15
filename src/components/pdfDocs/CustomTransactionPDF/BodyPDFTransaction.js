import { Text, View, StyleSheet } from '@react-pdf/renderer';

const { textIndent } = StyleSheet.create({
  textIndent: {
    textIndent: '20px',
    textAlign: 'justify',
  },
});

const BodyPDFTransaction = ({
  contractNumber,
  contractDate,
  businessName,
  createOn,
  amount,
  pan,
  tranId,
}) => {
  return (
    <View>
      <Text style={[textIndent]}>
          ТОВ «ПЕЙТЕК УКРАЇНА» (код ЄДРПОУ 44103264) надає послуги з переказу коштів в національній валюті без
          відкриття рахунків.
      </Text>
      <Text style={[textIndent]}>
          Для цього Товариство внесене в державний реєстр фінансових установ (Свідоцтво про реєстрацію фінансової установи
          від 27.08.2021 серії ФК № В0000338, Ліцензія Національного банку України на переказ коштів у національній валюті без
          відкриття рахунків від 26.11.2021 року).
      </Text>
      <Text style={[textIndent]}>
        Між нашими Товариствами було укладено Договір про організацію переказу
        грошових коштів №{contractNumber} від {contractDate}.
      </Text>
      <Text style={[textIndent]}>
        Відповідно до зазначеного Договору було успішно перераховано кошти на
        платіжну картку клієнта від ТОВ «{businessName}»:
      </Text>
      <Text style={[textIndent]}>
        {createOn} на суму {amount} грн, маска картки {pan}, номер транзакції в
        системі ТОВ «ПЕЙТЕК УКРАЇНА» – {tranId}, призначення платежу:
        зарахування на карту {pan}.
      </Text>
    </View>
  );
};

export default BodyPDFTransaction;
