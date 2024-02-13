const CenterPos = () => {
  /**
   * CenterPosition 클릭 이벤트
   */
  const handleCenterPosition = () => {
    const center = document.getElementById('center');
    center.classList.toggle('show');
  };

  return (
    <>
      <CenterStyle id="center" className="show" />
      <div
        onClick={handleCenterPosition}
        title="Toggle center position"
        className="ol-position center-position ol-unselectable ol-control">
        <i className="fa fa-crosshairs fa-2x"
      />
      </div>
    </>
  );
};

export default CenterPos;
