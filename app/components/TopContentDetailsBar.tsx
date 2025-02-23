import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const TopContentDetailsBar = ({ onNavBack }: { onNavBack: () => void }) => {
  return (
    <div
      className="flex items-center px-4 w-full h-14 bg-nav-bg"
      onClick={onNavBack}
    >
      <FontAwesomeIcon icon={faArrowLeft} className="text-2xl" />
    </div>
  );
};

export default TopContentDetailsBar;
