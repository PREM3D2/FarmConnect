import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Dimensions, ScrollView } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { Project } from '../../ProjectListScreen';
import CropService from '../../../../services/CropService';
import { AppFunctions } from '../../../../Helpers/AppFunctions';
import DateControl from '../../../../components/DateControl';
import { showToast } from '../../../../components/ShowToast';
import { Card } from 'react-native-paper';


const CropStacking: React.FC<{ project: Project, cropCode: number }> = ({ project, cropCode }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [cropDetail, setCropDetail] = useState<any>();
    const [editLand, setEditLand] = useState<any>(null);
    const [reloadList, setReloadList] = useState(false);

    const openAddModal = () => {
        setEditLand(null);
        setModalVisible(true);
    };

    const handleUpdateStackingDate = async (values: any) => {
        const stackingStatusData = {
            plotCropId: cropCode,
            stackingStatus: true,
            stackingDate: values.stackingDate,
        };
        const updateStackingDate = async () => {
            try {
                const response = await CropService.updatecropStackingDate(stackingStatusData);
                const toastType = response.result.success ? 'success' : 'error'
                if (response.result.success) {
                    setReloadList(!reloadList);
                    showToast(toastType, "Stacking Status", response.result.successMessage);
                }
                else {
                    showToast(toastType, "Stacking Status", response.result.errorMessage);
                }
            } catch (error: any) {
                showToast('error', "Stacking Status", error.message);
            }
        };
        await updateStackingDate();
    }


    useEffect(() => {
        const fetchCropDetail = async () => {
            try {
                const response = await CropService.getcropDetailbycropid(project.projectId, cropCode);
                setCropDetail(response.result || []);
            } catch (error) {
            }
        };
        fetchCropDetail();
    }, [reloadList]);

    const validationSchema = Yup.object().shape({
        stackingDate: Yup.string().required('Date is required'),
    });

    return (
        <View style={{ flex: 1 }}>
            {!cropDetail?.stackingStatus
                &&
                <TouchableOpacity style={styles.addBtn} onPress={openAddModal}>
                    <Icon name="plus-circle" size={24} color='#388e3c' />
                    <Text style={styles.addBtnText}>Add Stacking</Text>
                </TouchableOpacity>
            }
            {cropDetail?.stackingStatus
                &&
                <Card style={styles.card}>
                    <Card.Content>
                        <View>
                            <Text style={styles.sectionValue}><MaterialCommunityIcons name="cube-outline" size={18} color="#009688" /> Stacking:</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10 }}>
                            <Text style={styles.section}>
                                - Date:  <Text style={styles.sectionValue}> {AppFunctions.formatDate(cropDetail?.stackingDate)} </Text>
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10 }}>
                            <Text style={styles.section}>
                                - Description:<Text style={styles.sectionValue}>  Stacking is Installed</Text>
                            </Text>
                        </View>
                    </Card.Content>
                </Card>
            }
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <ScrollView contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
                            <Text style={styles.modalTitle}>{editLand ? 'Edit CropStacking' : 'Add CropStacking'}</Text>
                            <Formik
                                initialValues={{
                                    stackingDate: editLand?.stackingDate || '',
                                    code: cropDetail?.code,
                                }}
                                validationSchema={validationSchema}
                                onSubmit={(values, { resetForm }) => {
                                    handleUpdateStackingDate(values);
                                    setModalVisible(false);
                                    resetForm();
                                }}
                            >
                                {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
                                    <>
                                        {/* <Text>{JSON.stringify(errors, null, 2)} </Text> */}
                                        <DateControl
                                            value={values.stackingDate}
                                            setFieldValue={setFieldValue}
                                            name="stackingDate"
                                            error={touched.stackingDate && errors.stackingDate ? errors.stackingDate : ''}
                                            touched={touched.stackingDate}
                                            placeholder="Stacking Date"
                                            required={true}
                                        />
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
    addBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: 10,
        margin: 16,
        borderRadius: 8,
        marginBottom: 0,
    },
    section: { fontSize: 16, marginTop: 10, },
    sectionValue: { fontSize: 16, marginTop: 10, fontWeight: 'bold' },
    addBtnText: {
        marginLeft: 8,
        color: '#388e3c',
        fontWeight: 'bold',
        fontSize: 16,
    },
    card: { borderRadius: 12, elevation: 3, backgroundColor: "#fff", marginVertical: 10, marginHorizontal: 10 },
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

export default CropStacking;

