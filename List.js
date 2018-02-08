import React, { Component } from 'react'
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native'

export default class List extends Component {

    renderItem = (item, i) => {
        const {onPressItem} = this.props

        return (
            <TouchableOpacity
                key={i}
                style={styles.item}
                onPress={() => onPressItem(this.props.list[i])} > 
                <Text>{item.panchado + ' ' +item.reason}</Text>
            </TouchableOpacity>
        )
    }

    render() {
        const {list} = this.props

        return (
            <View>
                {list.map(this.renderItem)}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    item: {
        backgroundColor: 'whitesmoke',
        marginBottom: 5,
        padding: 15
    }
})
