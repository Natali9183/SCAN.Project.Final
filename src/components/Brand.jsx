import { Link } from 'react-router-dom';

export default function Brand({ footer = false }) {
  return (
    <Link className="brand" to="/" aria-label="СКАН">
      <img src={footer ? '/scan-logo-white.svg' : '/scan-logo.svg'} alt="СКАН" />
    </Link>
  );
}
