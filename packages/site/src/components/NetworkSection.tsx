import { SectionContainer } from './SectionContainer';
import { SectionTitle } from './SectionTitle';

const NetworkSection = ({ children }: any) => {
  return (
    <SectionContainer>
      <SectionTitle style={{ fontFamily: 'Poppins-Reg', fontWeight: 600 }}>
        Network Details
      </SectionTitle>
      {children}
    </SectionContainer>
  );
};

export default NetworkSection;
