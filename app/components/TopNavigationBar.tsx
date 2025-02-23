import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const TopNavigationBar = ({ onNavBack }: { onNavBack: () => void }) => {
  return (
    <div
      className="flex shrink-0 items-center px-4 w-full h-14 bg-nav-bg"
      onClick={onNavBack}
    >
      <FontAwesomeIcon icon={faArrowLeft} className="text-2xl" />
    </div>
  );
};

export default TopNavigationBar;
