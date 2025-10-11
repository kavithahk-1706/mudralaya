import { BsRecordCircle, BsStopCircle } from 'react-icons/bs';
import { forwardRef } from 'react';

const RecordButton = forwardRef(({ isRecording, onStartRecording, onStopRecording, onLogin, user }, ref) => {
  const buttonStyle = {
    position: 'absolute',
    top: 575,
    right: 25,
    padding: '8px',
    fontSize: '25px',
    color: '#ffffffff',
    borderRadius: '10px',
    border: 'none',
    cursor: 'pointer',
    minWidth: '250px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    zIndex: 100
  };

  if (!user) {
    return (
      <button 
        onClick={onLogin}
        style={{
          ...buttonStyle,
          background: 'linear-gradient(45deg, hsla(0, 75%, 50%, 0.9), hsla(15, 85%, 45%, 0.9))'
        }}
        ref={ref}
      >
        Login to Record
      </button>
    );
  }

  return (
    <button 
      onClick={isRecording ? onStopRecording : onStartRecording}
      style={{
        ...buttonStyle,
        background: isRecording 
          ? 'linear-gradient(45deg, hsla(0, 75%, 50%, 0.9), hsla(15, 85%, 45%, 0.9))'
          : 'linear-gradient(45deg, hsla(275, 65%, 52%, 0.9), hsla(165, 75%, 50%, 0.9))'
      }}
      ref={ref}
    >
      {isRecording ? <BsStopCircle /> : <BsRecordCircle />}
      {isRecording ? 'Click to stop Recording' : 'Click to Record'}
    </button>
  );
});

export default RecordButton;