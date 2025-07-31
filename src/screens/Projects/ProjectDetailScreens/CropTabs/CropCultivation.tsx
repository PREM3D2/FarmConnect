import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Dimensions, ScrollView } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Yup from 'yup';
import { Formik } from 'formik';
import AppTextInput from '../../../../components/AppTextInput';
import { Project } from '../../ProjectListScreen';
import CropService from '../../../../services/CropService';
import { AppFunctions } from '../../../../Helpers/AppFunctions';
import DateControl from '../../../../components/DateControl';
import { showToast } from '../../../../components/ShowToast';

const CropCultivation: React.FC<{ project: Project, cropCode: number }> = ({ project, cropCode }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [cropDetail, setCropDetail] = useState<any>();
    const [editCropProtection, setEditCropProtection] = useState<any>(null);
    const [reloadList, setReloadList] = useState(false);
    const [isChangeStatus, setIsChangeStatus] = useState(false);


    const openAddModal = () => {
        setEditCropProtection(null);
        setModalVisible(true);
        setIsChangeStatus(false);
    };


    const openEditModal = (land: any) => {
        setEditCropProtection(land);
        setModalVisible(true);
        setIsChangeStatus(false);
    };

    const openChangeStatusModal = (land: any) => {
        setEditCropProtection(land);
        setModalVisible(true);
        setIsChangeStatus(true);
    };

    const handleCultivationExpectedDateUpdate = async (values: any) => {
        const cultivationData = {
            plotCropId: cropCode,
            expectedDate: values.cultivationExpectedDate,
        };
        const updateCultivationExpectedDate = async () => {
            try {
                const response = await CropService.updateCultivationExpectedDate(cultivationData);
                const toastType = response.result.success ? 'success' : 'error'
                if (response.result.success) {
                    showToast(toastType, "Cultivation", response.result.successMessage);
                }
                else {
                    showToast(toastType, "Cultivation", response.result.errorMessage);
                }
            } catch (error: any) {
                showToast('error', "Cultivation", error.message);
            }
        };
        await updateCultivationExpectedDate();
        setReloadList(!reloadList);
    }

    const handleCultivationActualDateUpdate = async (values: any) => {
        const cultivationData = {
            code: values.code,
            plotCropId: cropCode,
            actualDate: values.cultivationActualDate,
            actualDateNotes: values.cultivationActualDateNotes,
        };
        const updateCultivationActualDate = async () => {
            try {
                const response = await CropService.updateCultivationActualDate(cultivationData);
                const toastType = response.result.success ? 'success' : 'error'
                if (response.result.success) {
                    showToast(toastType, "Cultivation", response.result.successMessage);
                }
                else {
                    showToast(toastType, "Cultivation", response.result.errorMessage);
                }
            } catch (error: any) {
                showToast('error', "Cultivation", error.message);
            }
        };
        await updateCultivationActualDate();
        setReloadList(prev => !prev);
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


    const getValidationSchema = (isChangeStatus: boolean) =>
        Yup.object().shape({
            cultivationExpectedDate: Yup.string().required('Date is required'),
            cultivationActualDate: Yup.string()
                .nullable()
                .when([], {
                    is: () => isChangeStatus,
                    then: schema => schema.required('Actual Date is required'),
                    otherwise: schema => schema.nullable(),
                }),
            cultivationActualDateNotes: Yup.string()
                .nullable()
                .when([], {
                    is: () => isChangeStatus,
                    then: schema => schema.required('Notes is required'),
                    otherwise: schema => schema.nullable(),
                }),
        });

    return (
        <View style={{ flex: 1 }}>
            {!cropDetail?.cultivationStatus &&
                <TouchableOpacity style={styles.addBtn} onPress={openAddModal}>
                    <Icon name="plus-circle" size={24} color='#388e3c' />
                    <Text style={styles.addBtnText}>Add Cultivation</Text>
                </TouchableOpacity>}
            {cropDetail?.cultivationStatus &&
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.landName}>{cropDetail?.plotCropName}</Text>
                        <View style={styles.cardActions}>
                            <TouchableOpacity onPress={() => openEditModal(cropDetail)}>
                                <Icon name="pencil" size={22} color="#388e3c" />
                            </TouchableOpacity>
                            <TouchableOpacity style={{ marginLeft: 8 }} onPress={() => openChangeStatusModal(cropDetail)}>
                                <MaterialCommunityIcons name="tag" size={22} color="#388e3c" />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <Text style={{ fontSize: 16, marginVertical: 4 }}><MaterialCommunityIcons name="tractor" size={18} color="#795548" />  Cultivation Expected Date : {AppFunctions.formatDate(cropDetail?.cultivationExpectedDate)}</Text>
                    <Text style={{ fontSize: 16, marginVertical: 4 }}><MaterialCommunityIcons name="tractor" size={18} color="#795548" />  Cultivation Actual Date : {AppFunctions.formatDate(cropDetail?.cultivationActualDate)}</Text>
                    <Text style={{ fontSize: 16, marginVertical: 4, marginLeft: 28 }}>Notes: {cropDetail?.cultivationActualDateNotes}</Text>

                </View>
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
                            <Text style={styles.modalTitle}>{editCropProtection ? 'Edit Cultivation' : 'Add Cultivation'}</Text>
                            <Formik
                                initialValues={{
                                    cultivationExpectedDate: editCropProtection?.cultivationExpectedDate || '',
                                    code: editCropProtection?.code || '',
                                    cultivationActualDate: editCropProtection?.cultivationActualDate || '',
                                    cultivationActualDateNotes: editCropProtection?.cultivationActualDateNotes as string || '',
                                }}
                                validationSchema={getValidationSchema(isChangeStatus)}
                                onSubmit={(values, { resetForm }) => {
                                    if (!isChangeStatus) {
                                        handleCultivationExpectedDateUpdate(values);
                                    }
                                    else {
                                        handleCultivationActualDateUpdate(values);
                                    }
                                    setModalVisible(false);
                                    resetForm();
                                }}
                            >
                                {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
                                    <>
                                        {/* <Text>{JSON.stringify(errors, null, 2)} </Text> */}
                                        {!isChangeStatus && <>
                                            <DateControl
                                                value={values.cultivationExpectedDate}
                                                setFieldValue={setFieldValue}
                                                name="cultivationExpectedDate"
                                                error={touched.cultivationExpectedDate && errors.cultivationExpectedDate ? errors.cultivationExpectedDate : ''}
                                                touched={touched.cultivationExpectedDate}
                                                placeholder="Cultivation Expected Date"
                                                required={true}
                                            />
                                        </>}

                                        {isChangeStatus && <>
                                            <DateControl
                                                value={values.cultivationActualDate}
                                                setFieldValue={setFieldValue}
                                                name="cultivationActualDate"
                                                error={touched.cultivationActualDate && errors.cultivationActualDate ? errors.cultivationActualDate : ''}
                                                touched={touched.cultivationActualDate}
                                                placeholder="Cultivation Actual Date"
                                                required={true}
                                            />
                                            <AppTextInput
                                                placeholder="Notes"
                                                maxLength={45}
                                                onBlur={handleBlur('cultivationActualDateNotes')}
                                                value={values.cultivationActualDateNotes}
                                                required={true}
                                                error={touched.cultivationActualDateNotes && errors.cultivationActualDateNotes ? errors.cultivationActualDateNotes : ''}
                                                onChangeText={handleChange('cultivationActualDateNotes')} />
                                        </>}
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
        margin: 10,
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

export default CropCultivation;

