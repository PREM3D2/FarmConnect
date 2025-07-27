import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, Dimensions, ScrollView, Alert } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Dropdown } from 'react-native-element-dropdown';
import * as Yup from 'yup';
import { Formik } from 'formik';
import LandService from '../../../../services/LandService';
import AppTextInput from '../../../../components/AppTextInput';
import { Project } from '../../ProjectListScreen';
import CropService from '../../../../services/CropService';
import { AppFunctions } from '../../../../Helpers/AppFunctions';
import DateControl from '../../../../components/DateControl';
import toastConfig from '../../../../components/ToastConfig';
import { showToast } from '../../../../components/ShowToast';


const riserSides = [
    { label: 'Length', value: 'length' },
    { label: 'Width', value: 'width' },
];

type Soil = {
    code: 1,
    soilColor: string,
    soilDesc: string
}
//need to update soilColor dropdown from API
const soilColor = [
    { label: 'Red', value: 1 },
    { label: 'Black', value: 2 },
];

type Plot = {
    code: number;
    projectId: number;
    projectName: string;
    plotName: string;
    plotLength: number;
    plotWidth: number;
    isRiser: boolean;
    riserCalMethod: string;
    plotRiserDistance: number;
    plotBedActualCount: number;
    soilId: number;
    soilColor: string;
    plotTotalArea: number;
    plotBedEstimateCount: number;
};

const CropNursery: React.FC<{ project: Project, cropCode: number }> = ({ project, cropCode }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [cropDetail, setCropDetail] = useState<any>();
    const [editLand, setEditLand] = useState<any>(null);
    const [reloadList, setReloadList] = useState(false);

    const openAddModal = () => {
        setEditLand(null);
        setModalVisible(true);
    };

    const openEditModal = (land: any) => {
        setEditLand(land);
        setModalVisible(true);
    };

    const handleUpdateNurseryDate = async (values: any) => {
        const nurseryStatusDate = {
            plotCropId: values.code,
            plantationNurseryRaised: true,
            plantationNurseryRaisedDate: values.plantationNurseryRaisedDate,
        };
        const updateNurseryDate = async () => {
            try {
                const response = await CropService.updatecropNurseryDate(nurseryStatusDate);
                const toastType = response.result.success ? 'success' : 'error'
                if (response.result.success) {
                    showToast(toastType, "Nursery Status", response.result.successMessage);
                }
                else {
                    showToast(toastType, "Nursery Status", response.result.errorMessage);
                }
            } catch (error: any) {
                showToast('error', "Nursery Status", error.message);
            }
        };
        updateNurseryDate();
        setReloadList(!reloadList);
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
        plantationNurseryRaisedDate: Yup.string().required('Date is required'),
    });

    return (
        <View style={{ flex: 1 }}>
            {!cropDetail?.plantationNurseryRaised
                &&
                <TouchableOpacity style={styles.addBtn} onPress={openAddModal}>
                    <Icon name="plus-circle" size={24} color='#388e3c' />
                    <Text style={styles.addBtnText}>Add Nursery</Text>
                </TouchableOpacity>
            }
            {cropDetail?.plantationNurseryRaised
                &&
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.landName}>{cropDetail?.plotCropName}</Text>
                        <View style={styles.cardActions}>
                            <TouchableOpacity onPress={() => openEditModal(cropDetail)}>
                                <Icon name="pencil" size={22} color="#388e3c" />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <Text style={{ fontSize: 16, marginVertical: 4 }}><MaterialCommunityIcons name="calendar" size={18} color="#3F51B5" />  Nursery Raised: {AppFunctions.formatDate(cropDetail?.plantationNurseryRaised)}</Text>
                    <Text style={{ fontSize: 16, marginVertical: 4, marginLeft: 28 }}>Description: "Nursery is Raised"</Text>
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
                            <Text style={styles.modalTitle}>{editLand ? 'Edit Nursery Date' : 'Add Nursery Date'}</Text>
                            <Formik
                                initialValues={{
                                    plantationNurseryRaisedDate: editLand?.plantationNurseryRaisedDate || '',
                                    code: cropDetail?.cropId,
                                }}
                                validationSchema={validationSchema}
                                onSubmit={(values, { resetForm }) => {
                                    handleUpdateNurseryDate(values);
                                    setModalVisible(false);
                                    resetForm();
                                }}
                            >
                                {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
                                    <>
                                        {/* <Text>{JSON.stringify(errors, null, 2)} </Text> */}
                                        <DateControl
                                            value={values.plantationNurseryRaisedDate}
                                            setFieldValue={setFieldValue}
                                            name="plantationNurseryRaisedDate"
                                            error={touched.plantationNurseryRaisedDate && errors.plantationNurseryRaisedDate ? errors.plantationNurseryRaisedDate : ''}
                                            touched={touched.plantationNurseryRaisedDate}
                                            placeholder="Nursery Date"
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

export default CropNursery;

