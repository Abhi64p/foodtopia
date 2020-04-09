import React, { Component } from 'react';
import { TouchableNativeFeedback, View, Image, Dimensions } from 'react-native';
import TextTicker from 'react-native-text-ticker';

const window = Dimensions.get('window');
const cardWidth = window.width * 0.85;
const cardHeight = cardWidth * 0.8625;

class ProductView extends Component {

    render() {
        return (
            <TouchableNativeFeedback onPress={this.onClick}>
                <View style={{
                    height: cardHeight, width: cardWidth, elevation: 2, borderRadius: 5,
                    backgroundColor: 'white', margin: 15, padding: 10
                }}>
                    <Image
                        source={{ uri: this.props.base }}
                        style={{ width: '100%', height: '85%' }}
                        resizeMode='cover'
                    />
                    <TextTicker
                        style={{ fontSize: 16, marginTop: 10 }}
                        duration={7000}
                        loop
                        repeatSpacer={50}
                        marqueeDelay={1000}
                    >
                        {this.props.item.name}
                    </TextTicker>
                </View>
            </TouchableNativeFeedback>
        );
    }

    onClick = () => {
        this.props.onPress(this.props.item);
    }

    shouldComponentUpdate() {
        return false;
    }
}

export default ProductView;