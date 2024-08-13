import { ThreeDots } from 'react-loader-spinner';
import './index.css'

const LoadingView = () => (
  <div className="loader-container">
    <ThreeDots color="#0b69ff" height={50} width={50} />
  </div>
);

export default LoadingView;
