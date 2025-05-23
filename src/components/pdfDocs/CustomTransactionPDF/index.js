import CustomPDFLayout from './../CustomPDFLayout';
import BodyPDFTransaction from './BodyPDFTransaction';

const CustomTransactionPDF = ({ data }) => {
  return (
    <CustomPDFLayout
      contractNumber={data.trxReference.contractNumber}
      contractDate={data.trxReference.contractDate}
      businessName={data.trxReference.businessName}
      docNumber={data.trxReference.docNumber}
    >
      <BodyPDFTransaction
        contractNumber={data.trxReference.contractNumber}
        contractDate={data.trxReference.contractDate}
        businessName={data.trxReference.businessName}
        createOn={data.trxReference.createOn}
        amount={data.trxReference.amount}
        pan={data.trxReference.pan}
        tranId={data.trxReference.trxUuid}
        uuid={data.uuid}
      />
    </CustomPDFLayout>
  );
};

export default CustomTransactionPDF;
