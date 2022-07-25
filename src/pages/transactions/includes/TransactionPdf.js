import React from 'react';
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';
import { toLocaleDateTime } from '@lib/date';

Font.register({
  family: 'Roboto',
  src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf',
});

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#FFF',
    fontSize: '12px',
    fontFamily: 'Roboto',
    fontWeight: 'normal',
    alignContent: 'flex-start',
    justifyContent: 'flex-start',
  },
  center: {
    textAlign: 'center',
    marginBottom: '15px',
  },
  p: {
    textIndent: '25px',
    marginBottom: '15px',
  },
  header: {
    margin: 10,
    padding: '10px 30px',
    flexGrow: 1,
    display: 'flex',
    flexWrap: 'nowrap',
    flexDirection: 'row',
    flex: '1 0 100%',
  },
  subheader: {
    margin: 10,
    padding: '10px 60px 30px 30px',
    flexGrow: 1,
    display: 'flex',
    flexWrap: 'nowrap',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: '1 0 100%',
  },
  signature: {
    margin: 10,
    padding: '10px 60px 30px 30px',
    flexGrow: 1,
    display: 'flex',
    flexWrap: 'nowrap',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: '1 0 100%',
  },

  content: {
    margin: 10,
    padding: 30,
    flexGrow: 1,
  },
});

const getDocNumber = (id, date) => {
  if (date !== undefined && id !== undefined) {
    const newDate = date.split('T')[0].replace(/-/g, '');
    return `${newDate}-${id}`;
  }
  return '';
};

const getRequestTime = () => {
  return toLocaleDateTime(new Date());
};

// Create Document Component
const MyDocument = (props) => {
  const { data } = props;
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/*<View style={styles.header}>*/}
        {/*  <Text>Section #1</Text>*/}
        {/*  <Text>Section #1</Text>*/}
        {/*  <Text>Section #1</Text>*/}
        {/*  <Text>Section #1</Text>*/}
        {/*</View>*/}
        <View style={styles.subheader}>
          <View>
            <Text>{`Вих. № ${getDocNumber(
              data.approval,
              data.createOn
            )}`}</Text>
            <Text>{`від ${getRequestTime()}`}</Text>
          </View>
          <Text>{`ТОВ «${data.businessName}»`}</Text>
        </View>
        <View style={styles.content}>
          <Text style={styles.center}>{'Шановні партнери!'}</Text>
          <Text style={styles.p}>
            {'Цим листом виражаємо Вам нашу повагу та повідомляємо наступне:'}
          </Text>
          <Text style={styles.p}>
            {
              'ТОВ «ПЕЙТЕК УКРАЇНА» (код ЄДРПОУ 44103264) надає послуги з переказу коштів в національній валюті без відкриття рахунків. '
            }
          </Text>
          <Text style={styles.p}>
            {
              'Для цього Товариство внесене в державний реєстр фінансових установ (Свідоцтво про реєстрацію фінансової установи від 27.08.2021 серії ФК № В0000338, Ліцензія Національного банку України на переказ коштів у національній валюті без відкриття рахунків від 26.11.2021 року).'
            }
          </Text>
          <Text style={styles.p}>
            {`Між нашими Товариствами було укладено Договір про організацію переказу грошових коштів № ${
              data.contractNumber
            } від ${
              data.contractDate !== undefined
                ? toLocaleDateTime(data.contractDate)
                : ''
            }.`}
          </Text>
          <Text style={styles.p}>
            {`Відповідно до зазначеного Договору було успішно перераховано кошти на платіжну картку клієнта від ТОВ «${data.businessName}»: `}
          </Text>
          <Text style={styles.p}>
            {`${
              data.createOn !== undefined ? toLocaleDateTime(data.editOn) : ''
            } на суму ${data.amount} грн, маска картки ${
              data.pan
            }, номер транзакції в системі ТОВ «ПЕЙТЕК УКРАЇНА» – ${
              data.tranId
            }, призначення платежу: зарахування на карту - маска картки ${
              data.pan
            }.`}
          </Text>
          <View style={styles.signature}>
            <View>
              <Text>{`Директор`}</Text>
              <Text>{`Шевченко Іван`}</Text>
            </View>
            <Text>{'signature'}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default MyDocument;
