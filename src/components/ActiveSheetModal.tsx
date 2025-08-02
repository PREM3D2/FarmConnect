import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface ActionSheetModalProps {
  visible: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const ActionSheetModal: React.FC<ActionSheetModalProps> = ({
  visible,
  onClose,
  onEdit,
  onDelete,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <TouchableOpacity style={styles.button} onPress={onEdit}>
            <Text style={styles.text}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={onDelete}>
            <Text style={[styles.text, { color: "red" }]}>Delete</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.text}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  button: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  text: {
    fontSize: 18,
    textAlign: "center",
  },
});

export default ActionSheetModal;