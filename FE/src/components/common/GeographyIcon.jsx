

function GeographyIcon({number}) {

  const styles = {
    wrapper:{
      display: 'flex',
      flexDirection : 'row',
      color: '#7f859e',
      fontSize: '12px',
      columnGap: '5px'
    }
  }
  return (
    <div style={{...styles.wrapper}}>
      <i className="bi bi-pin-map-fill"></i> 
      {number} km
    </div>
  )
}

export default GeographyIcon
