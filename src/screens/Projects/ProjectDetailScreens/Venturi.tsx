import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, Dimensions, ScrollView, Alert } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Yup from 'yup';
import { Formik } from 'formik';
import AppTextInput from '../../../components/AppTextInput';
import VenturiService from '../../../services/VenturiService';
import { Project } from '../ProjectListScreen';
import { useNavigation, useRoute } from '@react-navigation/core';
import { ActivityIndicator } from 'react-native-paper';
import { showToast } from '../../../components/ShowToast';


export type Venturi = {
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
    const [editventuri, setEditventuri] = useState<Venturi | null>(null);
    const [venturis, setventuris] = useState<Venturi[]>([]);
    const route = useRoute();
    const { project } = (route.params as { project: Project });
    const [reloadList, setReloadList] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const openAddModal = () => {
        setEditventuri(null);
        setModalVisible(true);
    };


    const openEditModal = (venturi: Venturi) => {
        setEditventuri(venturi);
        setModalVisible(true);
    };

    const handleDelete = (venturi: Venturi) => {
        const deleteventuri = async () => {
            try {
                await VenturiService.deleteventuri(venturi.code);
                showToast('success', 'Delete Venturi', 'Venturi has been Deleted Successfully');
            } catch (error) {
                showToast('error', 'Delete Venturi', 'Error while deleting Venturi');
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
            venturiNumber: values.venturiNumber,
        };
        const addventuri = async () => {
            try {
                const response = await VenturiService.addventuri(venturiData);
                const toastType = response.result.success ? 'success' : 'error'
                if (response.result.success) {
                    showToast(toastType, "Add Venturi", response.result.successMessage);
                }
                else {
                    showToast(toastType, "Add Venturi", response.result.errorMessage);
                }
            } catch (error) {
            }
        };
        addventuri();
        setReloadList(!reloadList);
    }

    const handleUpdateventuri = async (values: any) => {
        const venturiData = {
            projectId: project?.projectId,
            venturiName: values.venturiName,
            venturiNumber: values.venturiNumber,
            code: values.code,
        };
        const updateventuri = async () => {
            try {
                const response = await VenturiService.updateventuri(venturiData);
                const toastType = response.result.success ? 'success' : 'error'
                if (response.result.success) {
                    showToast(toastType, "Edit Venturi", response.result.successMessage);
                }
                else {
                    showToast(toastType, "Edit Venturi", response.result.errorMessage);
                }
            } catch (error) {
            }
            finally {
            }
        };
        updateventuri();
        setReloadList(!reloadList);
    }

    const navigation = useNavigation();

    useEffect(() => {
        setIsLoading(true);
        const fetchventuris = async () => {
            if (typeof project?.projectId !== 'number') return;
            try {
                const response = await VenturiService.getventurisbyprojectid(project.projectId);
                setventuris(response.result || []);
                setIsLoading(false);
            } catch (error) {
            }
        };
        fetchventuris();
    }, [reloadList]);

    const validationSchema = Yup.object().shape({
        venturiName: Yup.string().max(45).required('Name is required'),
        venturiNumber: Yup.string().required('Serial Number is required'),
    });


    const renderVenturi = ({ item }: { item: Venturi }) =>
         (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.landName}>{item.venturiName}</Text>
                <View style={styles.cardActions}>
                    <TouchableOpacity onPress={() => {
                        openEditModal(item);
                    }}>
                        <Icon name="pencil" size={22} color="#388e3c" />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ marginLeft: 8 }} onPress={() => confirmDelete(item)}>
                        <MaterialCommunityIcons name="delete" size={22} color="#900" />
                    </TouchableOpacity>
                </View>
            </View>
            <Text style={styles.field}>{item.venturiNumber}</Text>
            {/* <Text style={styles.field}>{item.pumpCodes}</Text> */}
        </View>
    );

    return (
        <View style={{ flex: 1 }}>
            {isLoading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color="#388e3c" />
                </View>
            )}
            <TouchableOpacity style={styles.addBtn} onPress={openAddModal}>
                <Icon name="plus-circle" size={24} color='#388e3c' />
                <Text style={styles.addBtnText}>Add Venturi</Text>
            </TouchableOpacity>
            <FlatList
                data={venturis}
                renderItem={renderVenturi}
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
                            <Text style={styles.modalTitle}>{editventuri ? 'Edit Venturi' : 'Add Venturi'}</Text>
                            <Formik
                                initialValues={{
                                    venturiName: editventuri?.venturiName || '',
                                    venturiNumber: editventuri?.venturiNumber?.toString() || '',
                                    code: editventuri?.code || '',
                                }}
                                validationSchema={validationSchema}
                                onSubmit={(values, { resetForm }) => {
                                    if (!editventuri) {
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
                                        <AppTextInput
                                            placeholder="Name"
                                            maxLength={45}
                                            onBlur={handleBlur('venturiName')}
                                            value={values.venturiName}
                                            required={true}
                                            error={touched.venturiName && errors.venturiName ? errors.venturiName : ''}
                                            onChangeText={handleChange('venturiName')} />
                                        <AppTextInput
                                            placeholder="Serail Number"
                                            onBlur={handleBlur('venturiNumber')}
                                            value={values.venturiNumber}
                                            required={true}
                                            error={touched.venturiNumber && errors.venturiNumber ? errors.venturiNumber : ''}
                                            onChangeText={handleChange('venturiNumber')} />

                                        <View style={styles.modalActions}>
                                            <TouchableOpacity style={styles.saveBtn} onPress={() => handleSubmit()}>
                                                <Text style={styles.saveBtnText}>Save</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={styles.cancelBtn} onPress={() => {
                                                setModalVisible(false);
                                            }}>
                                                <Text style={styles.cancelBtnText}>Cancel</Text>
                                            </TouchableOpacity>
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 16,
        paddingBottom: 8,
        paddingHorizontal: 16,
        backgroundColor: '#f7faff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    backBtn: {
        padding: 4,
        marginRight: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
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
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100%',
        width: '100%',
        backgroundColor: 'rgba(0,0,0,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
    },
});

export default Venturi;
