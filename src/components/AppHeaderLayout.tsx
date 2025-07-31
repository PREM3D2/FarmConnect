import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';
import { RootState } from '../store/store';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface AppHeaderLayoutProps {
  children: React.ReactNode;
}

const AppHeaderLayout: React.FC<AppHeaderLayoutProps> = ({ children }) => {
  const [modalVisible, setModalVisible] = React.useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const { dark, colors } = useTheme();
  const insets = useSafeAreaInsets();

  const handleLogout = () => {
    dispatch(logout());
    setModalVisible(false);
  };

  const fontColor = '#388e3c';
  const greenColor = '#ffffff';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View
        style={[
          styles.header,
          {
            backgroundColor: greenColor,
          },
        ]}
      >
        <Text style={[styles.headerTitle, { color: fontColor }]}>AGAATE</Text>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={[styles.avatarContainer, { backgroundColor: fontColor }]}
        >
          <Text style={[styles.avatarText, { color: greenColor }]}>
            {user?.firstName
              ? user.firstName
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()
              : 'U'}
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        transparent
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        {/* Dimmed overlay */}
        <Pressable
          style={styles.overlay}
          onPress={() => setModalVisible(false)}
        />
        
        {/* Top-right modal content */}
        <View
          style={[
            styles.modalContainer,
            {
              backgroundColor: dark ? '#1e1e1e' : '#fff',
              shadowColor: '#000',
              top: insets.top + 10,
            },
          ]}
        >
          <View style={styles.modalRow}>
            <MaterialCommunityIcons name="account-circle" size={22} color={colors.outline} />
            <Text style={[styles.title, { color: colors.onSurface }]}>
              {user?.firstName || 'User'}
            </Text>
          </View>
          <View style={styles.modalRow}>
            <MaterialCommunityIcons name="badge-account" size={22} color={colors.outline} />
            <Text style={[styles.subtitle, { color: colors.onSurfaceVariant }]}>
              {user?.roles?.[0] || ''}
            </Text>
          </View>
          <View style={styles.modalRow}>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <MaterialIcons name="exit-to-app" size={22} color={colors.outline} />
              <Text style={[styles.subtitle, { color: colors.onSurfaceVariant }]}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
    padding: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
    zIndex: 1,
  },
  headerTitle: {
    fontWeight: 'bold',
    fontSize: 22,
  },
  avatarContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontWeight: 'bold',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)', 
  },
  modalContainer: {
    position: 'absolute',
    right: 20,
    padding: 16,
    borderRadius: 8,
    elevation: 6,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    width: 200,
    zIndex: 999,
  },
  modalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  subtitle: {
    fontSize: 14,
    marginLeft: 8,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
});

export default AppHeaderLayout;
