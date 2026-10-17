import { BsRecordCircle, BsStopCircle, BsPersonCircle } from 'react-icons/bs';
import { forwardRef } from 'react';
import { ControlButton } from './Controls';
import theme from '../utils/theme';

const RecordButton = forwardRef(({ isRecording, onStartRecording, onStopRecording, onLogin, user }, ref) => {
  if (!user) {
    return (
      <ControlButton ref={ref} onClick={onLogin}>
        <BsPersonCircle style={{ color: theme.accent }} />
        Log in to record
      </ControlButton>
    );
  }

  return (
    <ControlButton
      ref={ref}
      onClick={isRecording ? onStopRecording : onStartRecording}
      style={isRecording ? { borderColor: theme.vermilion, background: 'rgba(200, 64, 47, 0.25)' } : undefined}
    >
      {isRecording
        ? <BsStopCircle style={{ color: theme.vermilion }} />
        : <BsRecordCircle style={{ color: theme.vermilion }} />}
      {isRecording ? 'Stop recording' : 'Record'}
    </ControlButton>
  );
});

export default RecordButton;
