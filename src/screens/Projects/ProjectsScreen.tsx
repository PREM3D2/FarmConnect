import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Modal, Pressable } from 'react-native';
import ProjectListScreen from './ProjectListScreen';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';


const ProjectsScreen = () => {
  const [modalVisible, setModalVisible] = React.useState(false);
  const user = { name: 'John Doe', role: 'Farmer' };
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f7faff' }}>
      {/* Custom Header */}
      <View style={styles.header}>
        {/* Title */}
        <Text style={styles.headerTitle}>Projects</Text>

        {/* Avatar */}
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={styles.avatarContainer}
        >
          <Text style={styles.avatarText}>
            {user.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()}
          </Text>
        </TouchableOpacity>

        {/* Modal */}
        <Modal
          transparent
          visible={modalVisible}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          {/* Background Overlay */}
          <Pressable
            style={styles.overlay}
            onPress={() => setModalVisible(false)}
          />

          {/* Modal Content Positioned Top Right */}
          <View style={styles.modalContainer}>
            <Text style={styles.title}>{user.name}</Text>
            <Text style={styles.subtitle}>{user.role}</Text>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>

      {/* Main content */}
      <ProjectListScreen />
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
    top: 70,
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
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    marginBottom: 12,
  },
  logoutButton: {
    backgroundColor: '#d9534f',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontWeight: '600',
  },
});


export default ProjectsScreen;
