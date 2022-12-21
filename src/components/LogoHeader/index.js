import logo from '@root/img/logo.png';
import './style.scss';

const Logo = () => {
  return (
    <span className="img-box">
      <img
        src={logo}
        alt="Logo"
        style={{ width: '100%' }}
        className="img-item"
      />
    </span>
  );
};

export default Logo;
