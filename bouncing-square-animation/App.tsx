import { StatusBar } from 'expo-status-bar';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import {
	useSharedValue,
	useAnimatedStyle,
	withTiming,
	withRepeat,
	withSpring
} from 'react-native-reanimated';
import Animated from 'react-native-reanimated';

const squareSize = 120;

export default function App() {
	const scale = useSharedValue(1);
	const rotate = useSharedValue(0);

	// position animation shared values
	const translateX = useSharedValue(0);
	const translateY = useSharedValue(0);

	const rStyle = useAnimatedStyle(() => {
		return {
			transform: [
				{
					translateX: translateX.value
				},
				{
					translateY: translateY.value
				},
				{
					scale: scale.value
				},
				{
					rotate: `${rotate.value}deg`
				}
			]
		};
	}, []);

	return (
		<View style={styles.container}>
			<StatusBar style='auto' />
			<Animated.View
				onTouchStart={() => {
					scale.value = withTiming(1.2);
				}}
				onTouchEnd={() => {
					scale.value = withTiming(1);
					// rotate.value = withRepeat(withTiming(rotate.value + 90), 4, false);
					rotate.value = withTiming(rotate.value + 90);
				}}
				style={[styles.square, rStyle]}
			/>
			<TouchableOpacity
				style={styles.button}
				onPress={() => {
					const maxTranslationAmount = 100;
					// We want to update translateX between [-100, 100]
					const tX =
						Math.random() * maxTranslationAmount * 2 - maxTranslationAmount;
					const tY =
						Math.random() * maxTranslationAmount * 2 - maxTranslationAmount;

					translateX.value = withRepeat(withSpring(tX), 4, true);
					translateY.value = withRepeat(withSpring(tY), 4, true);
				}}
			>
				<View></View>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center'
	},
	square: {
		width: squareSize,
		height: squareSize,
		backgroundColor: '#00a6ff',
		borderRadius: 30,
		borderCurve: 'continuous'
	},
	button: {
		height: 64,
		width: 64,
		backgroundColor: '#111',
		borderRadius: 32,
		position: 'absolute',
		bottom: 48,
		right: 32
	}
});
