import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

interface AppHeaderProps {
    title?: string;
    subtitle?: string;
    showBack?: boolean;
    children?: React.ReactNode;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ title = 'Trader', subtitle, showBack = false, children }) => {
    const navigation = useNavigation<any>();

    return (
        <View style={s.premiumHeader}>
            {/* Soft Spotlight Background Gradient */}
            <View style={StyleSheet.absoluteFillObject}>
                <LinearGradient
                    colors={['rgba(59, 130, 246, 0.08)', 'transparent']}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                    style={{ width: '100%', height: '100%' }}
                />
            </View>

            <View style={s.headerBarContent}>
                <View style={s.rowStartFlex}>
                    {showBack && (
                        <TouchableOpacity
                            style={[s.vaultIconBtn, { marginRight: 16 }]}
                            onPress={() => navigation.goBack()}
                            activeOpacity={0.8}
                        >
                            <Feather name="arrow-left" size={20} color="#F8FAFC" />
                        </TouchableOpacity>
                    )}
                    <View style={{ flex: 1, paddingRight: 8 }}>
                        <Text style={s.vaultTitle} numberOfLines={2}>
                            {title}
                        </Text>
                        {subtitle && (
                            <Text style={s.vaultSubtitle} numberOfLines={2}>
                                {subtitle}
                            </Text>
                        )}
                    </View>
                </View>

                <View style={s.rowStart}>
                    <TouchableOpacity style={s.vaultIconBtn} activeOpacity={0.8}>
                        <Feather name="bell" size={20} color="#F8FAFC" />
                    </TouchableOpacity>
                    <View style={{ width: 12 }} />
                    <TouchableOpacity style={s.vaultIconBtn} onPress={() => navigation.navigate('Settings')} activeOpacity={0.8}>
                        <Feather name="user" size={20} color="#F8FAFC" />
                    </TouchableOpacity>
                </View>
            </View>

            {children && (
                <View style={{ paddingHorizontal: 24, paddingBottom: 16 }}>
                    {children}
                </View>
            )}

            {/* The thin glowing baseline horizontal gradient divider */}
            <LinearGradient
                colors={['transparent', 'rgba(59, 130, 246, 0.8)', 'transparent']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ height: 1, width: '100%', position: 'absolute', bottom: 0 }}
            />
        </View>
    );
};

const s = StyleSheet.create({
    premiumHeader: {
        marginTop: 0,
        marginBottom: 0,
        backgroundColor: '#0A0A0B',
        paddingTop: Platform.OS === 'ios' ? 64 : 48,
        zIndex: 100,
        overflow: 'hidden',
    },
    headerBarContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingBottom: 20,
    },
    rowStartFlex: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    rowStart: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    vaultTitle: {
        fontSize: 22,
        color: '#F8FAFC',
        fontWeight: '800',
        
        letterSpacing: -0.5,
    },
    vaultSubtitle: {
        fontSize: 12,
        color: 'rgba(253, 224, 139, 0.7)',
        fontWeight: '500',
        
        marginTop: 2,
    },
    vaultIconBtn: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: '#131315',
        borderWidth: 1,
        borderColor: 'rgba(59, 130, 246, 0.25)',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 3,
    },
});
