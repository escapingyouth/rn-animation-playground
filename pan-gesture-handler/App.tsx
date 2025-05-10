import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import {
	useAnimatedStyle,
	useDerivedValue,
	useSharedValue,
	withSpring,
	withTiming
} from 'react-native-reanimated';
import Animated from 'react-native-reanimated';
import {
	Gesture,
	GestureDetector,
	GestureHandlerRootView,
	gestureHandlerRootHOC
} from 'react-native-gesture-handler';

const squareSize = 120;

function App() {
	const translateX = useSharedValue(0);
	const translateY = useSharedValue(0);
	const context = useSharedValue({ x: 0, y: 0 });
	const isDragging = useSharedValue(false);

	const rotate = useDerivedValue(() => {
		return withSpring(isDragging.value ? '45deg' : '0deg ');
	}, []);

	const scale = useDerivedValue(() => {
		return withSpring(isDragging.value ? 1 : 1.2);
	}, []);

	const color = useDerivedValue(() => {
		if (isDragging.value) return '#0099ff';

		const isInTheWhiteSpace = translateY.value < 0;
		const isInTheBlackSpace = translateY.value > 0;

		if (isInTheWhiteSpace) return '#000';
		if (isInTheBlackSpace) return '#fff';

		return '#0099ff';
	}, []);

	const animatedColor = useDerivedValue(() => {
		return withTiming(color.value);
	});

	const animatedStyles = useAnimatedStyle(() => {
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
					rotate: rotate.value
				}
			],
			backgroundColor: animatedColor.value
		};
	}, []);
	const panGesture = Gesture.Pan()
		.onBegin(() => {
			isDragging.value = true;
			context.value = { x: translateX.value, y: translateY.value };
		})
		.onUpdate((event) => {
			const { translationX, translationY } = event;
			translateX.value = translationX + context.value.x;
			translateY.value = translationY + context.value.y;
		})
		.onFinalize(() => {
			isDragging.value = false;
		});

	return (
		<GestureHandlerRootView>
			<View style={styles.container}>
				<StatusBar style='dark' />
				<GestureDetector gesture={panGesture}>
					<Animated.View style={[styles.square, animatedStyles]} />
				</GestureDetector>
				<View style={styles.background} />
			</View>
		</GestureHandlerRootView>
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
		height: squareSize,
		width: squareSize,
		borderRadius: 30,
		borderCurve: 'continuous',
		zIndex: 2
	},
	background: {
		position: 'absolute',
		top: '50%',
		left: 0,
		height: '50%',
		width: '100%',
		backgroundColor: '#000'
	}
});
export default gestureHandlerRootHOC(App);
