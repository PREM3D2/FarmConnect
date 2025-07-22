import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, TextInput, Pressable, Dimensions, ScrollView, Alert } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Dropdown } from 'react-native-element-dropdown';
import * as Yup from 'yup';
import { Formik } from 'formik';
import LandService from '../../../services/LandService';
import { useContext } from 'react';
import { ProjectDetailContext } from '../ProjectDetailScreen';
import AppTextInput from '../../../components/AppTextInput';
import VenturiService from '../../../services/VenturiService';


type Venturi = {
    code: number;
    projectId: number;
    projectName: string;
    venturiName: string;
    venturiNumber: string;
    pumpCount: number;
    pumpCodes: string[] | null;
};

const Venturi = () => {
  const [modalVisible, setModalVisible] = useState(false);
    const [editLand, setEditLand] = useState<Venturi | null>(null);
    const [venturis, setventuris] = useState<Venturi[]>([]);
    const project = useContext(ProjectDetailContext);
    const [reloadList, setReloadList] = useState(false);
    const [isEditCase, setIsEditCase] = useState(false);

    const openAddModal = () => {
        setEditLand(null);
        setModalVisible(true);
    };


    const openEditModal = (land: any) => {
        setEditLand(land);
        setModalVisible(true);
    };

    const handleDelete = (venturi: Venturi) => {
        const deleteventuri = async () => {
            try {
                const response = await VenturiService.deleteventuri(venturi.code);
            } catch (error) {
            }
        };
        deleteventuri();
        setReloadList(!reloadList);
    };

    const confirmDelete = (venturi: Venturi) => {
        Alert.alert(
            'Delete Venturi',
            `Do you want to Delete the Venturi ${venturi.venturiName}?`,
            [
                {
                    text: 'No',
                    style: 'cancel',
                },
                {
                    text: 'Yes',
                    onPress: () => handleDelete(venturi),
                    style: 'destructive',
                },
            ],
            { cancelable: true }
        );
    };

    const handleAddventuri = async (values: any) => {
        const venturiData = {
            projectId: project?.projectId,
            venturiName: values.venturiName,
            venturiNumber: parseFloat(values.venturiNumber),
        };
        console.log(venturiData, "venturiData");
        const addventuri = async () => {
            try {
               const response =  await VenturiService.addventuri(venturiData);
                console.log(response, "res")
            } catch (error) {
                console.error("Error adding venturi:", error);
            }
        };
        addventuri();
        setReloadList(!reloadList);
    }

    const handleUpdateventuri = async (values: any) => {
        const venturiData = {
            projectId: project?.projectId,
            venturiName: values.venturiName,
            venturiNumber: parseFloat(values.venturiNumber),
            code: values.code,
        };
        console.log(venturiData, "venturiData");
        const updateventuri = async () => {
            try {
               const response = await VenturiService.updateventuri(venturiData);
                console.log(response, "res")
                setIsEditCase(false)
            } catch (error) {
              console.error("Error updte venturi:", error);
            }
        };
        updateventuri();
        setReloadList(!reloadList);
    }

    useEffect(() => {
        const fetchventuris = async () => {
            if (typeof project?.projectId !== 'number') return;
            try {
                const response = await VenturiService.getventurisbyprojectid(project.projectId);
                setventuris(response.result || []);
            } catch (error) {
            }
        };
        fetchventuris();
    }, [reloadList]);

    const validationSchema = Yup.object().shape({
        venturiName: Yup.string().max(45).required('Name is required'),
        venturiNumber: Yup.number().typeError('Length must be a number').required('Length is required'),
    });

    const renderLand = ({ item }: { item: Venturi }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.landName}>{item.venturiName}</Text>
                <View style={styles.cardActions}>
                    <TouchableOpacity onPress={() => {
                        openEditModal(item);
                        setIsEditCase(true);
                    }}>
                        <Icon name="pencil" size={22} color="#388e3c" />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ marginLeft: 8 }} onPress={() => confirmDelete(item)}>
                        <MaterialCommunityIcons name="delete" size={22} color="#900" />
                    </TouchableOpacity>
                </View>
            </View>
            <Text style={styles.field}>{item.venturiNumber}</Text>
            <Text style={styles.field}>{item.pumpCodes}</Text>
        </View>
    );

    return (
        <View style={{ flex: 1 }}>
            <TouchableOpacity style={styles.addBtn} onPress={openAddModal}>
                <Icon name="plus-circle" size={24} color='#388e3c' />
                <Text style={styles.addBtnText}>Add Venturi</Text>
            </TouchableOpacity>
            <FlatList
                data={venturis}
                renderItem={renderLand}
                keyExtractor={item => item.code.toString()}
                contentContainerStyle={{ padding: 16 }}
            />
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <ScrollView contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
                            <Text style={styles.modalTitle}>{editLand ? 'Edit Venturi' : 'Add Venturi'}</Text>
                            <Formik
                                initialValues={{
                                    venturiName: editLand?.venturiName || '',
                                    venturiNumber: editLand?.venturiNumber?.toString() || '',
                                    code: editLand?.code || '',      
                                }}
                                validationSchema={validationSchema}
                                onSubmit={(values, { resetForm }) => {
                                    if (!isEditCase) {
                                        handleAddventuri(values);
                                    }
                                    else {
                                        handleUpdateventuri(values);
                                    }
                                    setModalVisible(false);
                                    resetForm();
                                }}
                            >
                                {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
                                    <>
                                        <Text>{JSON.stringify(errors, null, 2)} </Text>
                                        <AppTextInput
                                            placeholder="Name"
                                            maxLength={45}
                                            onBlur={() => handleBlur('venturiName')}
                                            value={values.venturiName}
                                            required={true}
                                            error={touched.venturiName && errors.venturiName ? errors.venturiName : ''}
                                            onChangeText={handleChange('venturiName')} />
                                        <AppTextInput
                                            placeholder="Serail Number"
                                            onBlur={() => handleBlur('venturiNumber')}
                                            keyboardType="decimal-pad"
                                            value={values.venturiNumber}
                                            required={true}
                                            error={touched.venturiNumber && errors.venturiNumber ? errors.venturiNumber : ''}
                                            onChangeText={handleChange('venturiNumber')} />
                                      
                                        <View style={styles.modalActions}>
                                            <Pressable style={styles.saveBtn} onPress={handleSubmit}>
                                                <Text style={styles.saveBtnText}>Save</Text>
                                            </Pressable>
                                            <Pressable style={styles.cancelBtn} onPress={() => {
                                                setModalVisible(false);
                                                setIsEditCase(false);
                                            }}>
                                                <Text style={styles.cancelBtnText}>Cancel</Text>
                                            </Pressable>
                                        </View>
                                    </>
                                )}
                            </Formik>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
 addBtn: {
         flexDirection: 'row',
         alignItems: 'center',
         justifyContent: 'flex-end',
         padding: 10,
         margin: 16,
         borderRadius: 8,
         marginBottom: 0,
     },
     addBtnText: {
         marginLeft: 8,
         color: '#388e3c',
         fontWeight: 'bold',
         fontSize: 16,
     },
     card: {
         backgroundColor: '#fff',
         borderRadius: 10,
         padding: 16,
         marginBottom: 16,
         elevation: 2,
     },
     cardHeader: {
         flexDirection: 'row',
         justifyContent: 'space-between',
         alignItems: 'center',
         marginBottom: 8,
     },
     landName: {
         fontSize: 18,
         fontWeight: 'bold',
         color: '#388e3c',
     },
     cardActions: {
         flexDirection: 'row',
     },
     field: {
         fontSize: 15,
         color: '#333',
         marginBottom: 2,
     },
     sectionRiser: {
         marginTop: 8,
         backgroundColor: '#f1f8e9',
         borderRadius: 6,
         padding: 8,
     },
     sectionTitle: {
         fontWeight: 'bold',
         color: '#388e3c',
         marginBottom: 4,
     },
     modalOverlay: {
         flex: 1,
         backgroundColor: 'rgba(0,0,0,0.3)',
         justifyContent: 'center',
         alignItems: 'center',
     },
     modalContent: {
         backgroundColor: '#fff',
         borderRadius: 18,
         paddingVertical: 24,
         paddingHorizontal: 18,
         width: Dimensions.get('window').width * 0.95,
         maxHeight: Dimensions.get('window').height * 0.92,
         elevation: 6,
         alignSelf: 'center',
         justifyContent: 'center',
     },
     modalTitle: {
         fontSize: 18,
         fontWeight: 'bold',
         color: '#388e3c',
         marginBottom: 16,
         textAlign: 'center',
     },
     input: {
         borderWidth: 1,
         borderColor: '#ccc',
         borderRadius: 6,
         padding: 10,
         marginBottom: 12,
         fontSize: 16,
     },
     checkboxRow: {
         flexDirection: 'row',
         alignItems: 'center',
         marginBottom: 12,
     },
     checkbox: {
         marginRight: 8,
     },
     checkboxLabel: {
         fontSize: 16,
         color: '#333',
     },
     dropdownRow: {
         flexDirection: 'row',
         alignItems: 'center',
         marginBottom: 12,
     },
     dropdownLabel: {
         fontSize: 16,
         color: '#333',
         marginRight: 8,
     },
     dropdown: {
         flex: 1,
         borderWidth: 1,
         borderColor: '#ccc',
         borderRadius: 6,
         paddingHorizontal: 10,
         height: 40,
         backgroundColor: '#fff',
     },
     error: {
         color: '#d32f2f',
         fontSize: 13,
         marginBottom: 8,
         marginLeft: 2,
     },
     modalActions: {
         flexDirection: 'row',
         justifyContent: 'space-between',
         marginTop: 16,
     },
     saveBtn: {
         backgroundColor: '#388e3c',
         paddingVertical: 10,
         paddingHorizontal: 24,
         borderRadius: 8,
     },
     saveBtnText: {
         color: '#fff',
         fontWeight: 'bold',
         fontSize: 16,
     },
     cancelBtn: {
         backgroundColor: '#eee',
         paddingVertical: 10,
         paddingHorizontal: 24,
         borderRadius: 8,
     },
     cancelBtnText: {
         color: '#333',
         fontWeight: 'bold',
         fontSize: 16,
     },
});

export default Venturi;
