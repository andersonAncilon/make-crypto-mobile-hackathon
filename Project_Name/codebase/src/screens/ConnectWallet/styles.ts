import { StyleSheet } from 'react-native';
import { dimensions } from '../../styles';
import { AlignTypes } from '../../utils/enum';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: dimensions.width19,
  },
  heading: {
    justifyContent: AlignTypes.CENTER,
    alignItems: AlignTypes.CENTER,
  },
  description: {
    marginHorizontal: 11,
    marginTop: dimensions.spacingStackXxs7,
    marginBottom: dimensions.spacingInlineXxl32,
  },
  descriptionText: {
    textAlign: 'center',
  },
  pillButton: {
    marginBottom: dimensions.spacingInlineXs14,
  },
});

export default styles;
