import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import theme from '../../../constants/theme';
import GradientTitle from './GradientTitle';

export default function Header() {
    const router = useRouter();

    return (
        <View style={[styles.header, styles.shadow]}>
            <View style={styles.textContainer}>
                <GradientTitle text={'DASHBOARD'} />
            </View>

            <TouchableOpacity 
                style={styles.iconButton} 
                onPress={() => router.push('./Profile')}
            >
                <Image 
                    source={require('@/assets/images/fondo1.png')}
                    style={styles.icon}
                    resizeMode="cover"
                />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        width: '100%',
        padding: 16,
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    textContainer: {
        flex: 1,
        marginTop: 30,
        marginRight: 20,
    },
    iconButton: {
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        marginTop: 20, 
        backgroundColor: theme.COLORS.lightGray,
        borderWidth: 2,
        borderColor: theme.COLORS.primary,
    },
    icon: {
        width: '90%',
        height: '90%',
        borderRadius: 45, 
    },
    shadow: {
        ...theme.SHADOWS.default,
        shadowColor: theme.COLORS.shadow,
    },
});