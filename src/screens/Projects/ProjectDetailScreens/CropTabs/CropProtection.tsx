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

type CropProtectionInfo = {
    code: number;
    plotCropId: number;
    protectionName: string;
    protectionDeployExpectedDate: string; // Format: 'YYYY-MM-DD'
    protectionDeployActualDate: string;   // Format: 'YYYY-MM-DD'
    protectionDeployActualDateNotes: string;
};

const CropProtection: React.FC<{ project: Project, cropCode: number }> = ({ project, cropCode }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [cropDetail, setCropDetail] = useState<any>();
    const [editCropProtection, setEditCropProtection] = useState<any>(null);
    const [plots, setPlots] = useState<Plot[]>([]);
    const [reloadList, setReloadList] = useState(false);
    const [soilDataOptions, setSoilDataOptions] = useState<Soil[]>([]);
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

    const handleDelete = (protection: CropProtectionInfo) => {
        const deletePlot = async () => {
            try {
                const response = await CropService.deleteCropProtectionExpected(protection.code);
                showToast('success', 'Delete Protection', 'Protection has been Deleted Successfully');
            } catch (error) {
                showToast('error', 'Delete Protection', 'Protection has been Deleted Successfully');
            }
        };
        deletePlot();
        setReloadList(!reloadList);
    };

    const confirmDelete = (protection: CropProtectionInfo) => {
        Alert.alert(
            'Delete CropProtection',
            `Do you want to Delete the CropProtection ${protection.protectionName}?`,
            [
                {
                    text: 'No',
                    style: 'cancel',
                },
                {
                    text: 'Yes',
                    onPress: () => handleDelete(protection),
                    style: 'destructive',
                },
            ],
            { cancelable: true }
        );
    };

    const handleAddEditProtection = async (values: any) => {
        const protectionAddData = {
            plotCropId: cropCode,
            protectionName: values.protectionName,
            protectionDeployExpectedDate: values.protectionDeployExpectedDate,
        };

        const protectionEditData = {
            code: values.code,
            plotCropId: cropCode,
            protectionName: values.protectionName,
            protectionDeployExpectedDate: values.protectionDeployExpectedDate,
        };


        const addEditProtection = async () => {
            try {
                const response = editCropProtection === null ? await CropService.addCropProtectionDate(protectionAddData) : await CropService.addCropProtectionDate(protectionEditData)
                console.log(response)
            } catch (error) {
                console.log(error, "err")
            }
        };
        addEditProtection();
        setReloadList(!reloadList);
    }

    const handleUpdatePlot = async (values: any) => {
        const protectionData = {
            code: values.code,
            plotCropId: cropCode,
            protectionDeployActualDate: values.protectionDeployActualDate,
            protectionDeployActualDateNotes: values.protectionDeployActualDateNotes,
        };
        const updatePlot = async () => {
            try {
                const response = await CropService.updateProtectionActualDate(protectionData);
                showToast('success', 'Actual Protection Date', 'Actual Protection has been added Successfully');
            } catch (error) {
                showToast('error', 'Actual Protection Date', 'Error');
            }
        };
        updatePlot();
        setReloadList(!reloadList);
    }

    useEffect(() => {
        const fetchSoilData = async () => {
            try {
                const response = await LandService.getAllSoils();
                setSoilDataOptions([...response.result || []]);
            } catch (error) {
            }
        };
        fetchSoilData();
    }, []);

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

    const renderProtectionItem = ({ item }: { item: CropProtectionInfo }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                {/* <Text style={styles.landName}>{cropDetail?.plotCropName}</Text> */}
                <View style={styles.cardActions}>
                    {item.protectionDeployActualDate === null && <>
                        <TouchableOpacity onPress={() => openEditModal(item)}>
                            <Icon name="pencil" size={22} color="#388e3c" />
                        </TouchableOpacity>
                        <TouchableOpacity style={{ marginLeft: 8 }} onPress={() => confirmDelete(item)}>
                            <MaterialCommunityIcons name="delete" size={22} color="#900" />
                        </TouchableOpacity></>}
                    <TouchableOpacity style={{ marginLeft: 8 }} onPress={() => openChangeStatusModal(item)}>
                        <MaterialCommunityIcons name="tag" size={22} color="#388e3c" />
                    </TouchableOpacity>
                </View>
            </View>
            <Text style={{ fontSize: 16, marginVertical: 4, }}><MaterialCommunityIcons name="shield" size={18} color="#FF9800" />  Protection Name: {item.protectionName}</Text>
            <Text style={{ fontSize: 16, marginVertical: 4, marginLeft: 28 }}>Protection Deploy Expected Date: {AppFunctions.formatDate(item.protectionDeployExpectedDate)}</Text>

            <Text style={{ fontSize: 16, marginVertical: 4, marginLeft: 28 }}>Protection Deploy Actual Date: {AppFunctions.formatDate(item.protectionDeployActualDate)}</Text>
            <Text style={{ fontSize: 16, marginVertical: 4, marginLeft: 28 }}>Notes: {item.protectionDeployActualDateNotes}</Text>

        </View>
    );

    // const validationSchema = (isActualDeployed: boolean) => Yup.object().shape({
    //     protectionDeployExpectedDate: Yup.string().required('Date is required'),
    //     protectionName: Yup.string().required('Protection Name is required'),
    //     protectionDeployActualDate: Yup.string().nullable(),
    //     protectionDeployActualDateNotes: Yup.string().nullable(),
    // });

    const getValidationSchema = (isChangeStatus: boolean) =>
        Yup.object().shape({
            protectionDeployExpectedDate: Yup.string().required('Date is required'),
            protectionName: Yup.string().required('Protection Name is required'),
            protectionDeployActualDate: Yup.string()
                .nullable()
                .when([], {
                    is: () => isChangeStatus,
                    then: schema => schema.required('Actual Date is required'),
                    otherwise: schema => schema.nullable(),
                }),
            protectionDeployActualDateNotes: Yup.string()
                .nullable()
                .when([], {
                    is: () => isChangeStatus,
                    then: schema => schema.required('Protection Notes are required'),
                    otherwise: schema => schema.nullable(),
                }),
        });

    return (
        <View style={{ flex: 1 }}>
            <TouchableOpacity style={styles.addBtn} onPress={openAddModal}>
                <Icon name="plus-circle" size={24} color='#388e3c' />
                <Text style={styles.addBtnText}>Add Protection</Text>
            </TouchableOpacity>


            <FlatList
                data={cropDetail?.extraProtections}
                renderItem={renderProtectionItem}
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
                            <Text style={styles.modalTitle}>{isChangeStatus ? 'Change Status' : (editCropProtection ? 'Edit CropProtection' : 'Add CropProtection')}</Text>
                            <Formik
                                initialValues={{
                                    protectionDeployExpectedDate: editCropProtection?.protectionDeployExpectedDate || '',
                                    code: editCropProtection?.code || '',
                                    protectionName: editCropProtection?.protectionName as string || '',
                                    protectionDeployActualDate: editCropProtection?.protectionDeployActualDate || '',
                                    protectionDeployActualDateNotes: editCropProtection?.protectionDeployActualDateNotes as string || '',

                                }}
                                validationSchema={getValidationSchema(isChangeStatus)}
                                onSubmit={(values, { resetForm }) => {
                                    if (!isChangeStatus) {
                                        handleAddEditProtection(values);
                                    }
                                    else {
                                        handleUpdatePlot(values);
                                    }
                                    setModalVisible(false);
                                    resetForm();
                                }}
                            >
                                {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
                                    <>
                                        {/* <Text>{JSON.stringify(errors, null, 2)} </Text> */}
                                        {!isChangeStatus && <>
                                            <AppTextInput
                                                placeholder="Protection Name"
                                                maxLength={45}
                                                onBlur={handleBlur('protectionName')}
                                                value={values.protectionName}
                                                required={true}
                                                error={touched.protectionName && errors.protectionName ? errors.protectionName : ''}
                                                onChangeText={handleChange('protectionName')} />
                                            <DateControl
                                                value={values.protectionDeployExpectedDate}
                                                setFieldValue={setFieldValue}
                                                name="protectionDeployExpectedDate"
                                                error={touched.protectionDeployExpectedDate && errors.protectionDeployExpectedDate ? errors.protectionDeployExpectedDate : ''}
                                                touched={touched.protectionDeployExpectedDate}
                                                placeholder="Protection Deploy Expected Date"
                                                required={true}
                                            />
                                        </>}

                                        {isChangeStatus && <>
                                            <DateControl
                                                value={values.protectionDeployActualDate}
                                                setFieldValue={setFieldValue}
                                                name="protectionDeployActualDate"
                                                error={touched.protectionDeployActualDate && errors.protectionDeployActualDate ? errors.protectionDeployActualDate : ''}
                                                touched={touched.protectionDeployActualDate}
                                                placeholder="Protection Deploy Actual Date"
                                                required={true}
                                            />
                                            <AppTextInput
                                                placeholder="Notes"
                                                maxLength={45}
                                                onBlur={handleBlur('protectionDeployActualDateNotes')}
                                                value={values.protectionDeployActualDateNotes}
                                                required={true}
                                                error={touched.protectionDeployActualDateNotes && errors.protectionDeployActualDateNotes ? errors.protectionDeployActualDateNotes : ''}
                                                onChangeText={handleChange('protectionDeployActualDateNotes')} />
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
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
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

export default CropProtection;

