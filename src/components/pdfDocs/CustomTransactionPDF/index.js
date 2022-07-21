import CustomPDFLayout from './../CustomPDFLayout';
import BodyPDFTransaction from './BodyPDFTransaction';
import moment from 'moment';

const getDateAndTime = (date) => {
  return date ? moment(date).format('DD.MM.YYYY hh:mm:ss') : '';
};
const CustomTransactionPDF = ({ data }) => {
  return (
    <CustomPDFLayout
      contractNumber={data.contractNumber}
      contractDate={getDateAndTime(data.contractDate)}
      businessName={data.businessName}
    >
      <BodyPDFTransaction
        contractNumber={data.contractNumber}
        contractDate={getDateAndTime(data.contractDate)}
        businessName={data.businessName}
        createOn={getDateAndTime(data.createOn)}
        amount={data.amount}
        pan={data.pan}
        tranId={data.tranId}
      />
    </CustomPDFLayout>
  );
};

export default CustomTransactionPDF;
