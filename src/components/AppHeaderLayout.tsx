import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, Modal, Pressable, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';
import { RootState } from '../store/store';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface AppHeaderLayoutProps {
    children: React.ReactNode;
}

const AppHeaderLayout: React.FC<AppHeaderLayoutProps> = ({ children }) => {
    const [modalVisible, setModalVisible] = React.useState(false);
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.auth.user);

    const handleLogout = () => {
        dispatch(logout());
        setModalVisible(false);
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            {/* Custom Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>AGAATE</Text>
                <TouchableOpacity
                    onPress={() => setModalVisible(true)}
                    style={styles.avatarContainer}
                >
                    <Text style={styles.avatarText}>
                        {user?.firstName
                            ? user.firstName.split(' ').map((n) => n[0]).join('').toUpperCase()
                            : 'U'}
                    </Text>
                </TouchableOpacity>
                <Modal
                    transparent
                    visible={modalVisible}
                    animationType="fade"
                    onRequestClose={() => setModalVisible(false)}
                >
                    <Pressable style={styles.overlay} onPress={() => setModalVisible(false)} />
                    <View style={styles.modalContainer}>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginBottom: 6, }}>
                            <MaterialCommunityIcons name="account-circle" size={22} color="grey" />
                            <Text style={styles.title}>{user?.firstName || 'User'}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginBottom: 6, }}>
                            <MaterialCommunityIcons name="badge-account" size={22} color="grey" />
                            <Text style={styles.subtitle}>{user?.roles?.[0] || ''}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', }}>
                            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                                <MaterialIcons name="exit-to-app" size={22} color="grey" />
                                <Text style={styles.subtitle}>Logout</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
            {/* Stack Navigator screens below header */}
            <View style={{ flex: 1 }}>{children}</View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 18,
        paddingBottom: 10,
        backgroundColor: '#f7faff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    headerTitle: {
        fontWeight: 'bold',
        fontSize: 22,
        color: '#388e3c',
    },
    avatarContainer: {
        backgroundColor: '#388e3c',
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    overlay: {
        flex: 1,
    },
    modalContainer: {
        position: 'absolute',
        top: 50,
        right: 20,
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        width: 180,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 5
    },
    subtitle: {
        fontSize: 14,
        color: '#555',
        marginLeft: 5
    },
    logoutButton: {
        // backgroundColor: '#d9534f',
        paddingVertical: 8,
       flexDirection: 'row',
        alignItems: 'center',
    },
    logoutText: {
        color: '#555',
        fontWeight: '600',
    },
});

export default AppHeaderLayout;
