const MapSection = ({ lat, lng }) => {
  const defaultLat = 12.9716; // Bengaluru
  const defaultLng = 77.5946;

  const finalLat = lat || defaultLat;
  const finalLng = lng || defaultLng;

  const src = `https://www.google.com/maps?q=${finalLat},${finalLng}&z=15&output=embed`;

  return (
    <div className="w-full h-full">
      <iframe
        src={src}
        width="100%"
        height="100%"
        allowFullScreen
        loading="lazy"
        title="Map"
      />
    </div>
  );
};

export default MapSection;
