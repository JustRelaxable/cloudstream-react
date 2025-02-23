const ContentThumbnail: React.FC<{
  content: SearchResponse;
  onClick: () => void;
}> = ({ content, onClick }) => {
  return (
    <div
      className="flex flex-col items-center cursor-pointer"
      onClick={onClick}
    >
      <div className="w-32 h-48 ">
        <img
          src={content.posterUrl}
          alt={content.name}
          className="w-full h-full object-cover rounded-md"
        />
      </div>
      <p className="text-center text-sm mt-2">{content.name}</p>
    </div>
  );
};

export default ContentThumbnail;
