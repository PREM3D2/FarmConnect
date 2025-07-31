import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Dimensions, ScrollView, Alert } from 'react-native';
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
import { Card } from 'react-native-paper';
import AppDropdown from '../../../../components/AppDropdown';


const CropUproot: React.FC<{ project: Project, cropCode: number }> = ({ project, cropCode }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [cropDetail, setCropDetail] = useState<any>();
    const [editUproot, setEditUproot] = useState<any>(null);
    const [reloadList, setReloadList] = useState(false);
    const [failureReasons, setFailureReasons] = useState([]);
    const [isActualCard, setIsActualCard] = useState<boolean>(false);

    const openEditModal = (land: any, isactual: boolean) => {
        setIsActualCard(isactual);
        setEditUproot(land);
        setModalVisible(true);
    };

    const handleChangeUprootActualData = async (values: any) => {
        const harvestData = {
            plotCropId: cropCode,
            actualDate: values.actualDate,
            actualDateNotes: values.actualDateNotes,
            cropFailure: values.cropFailure,
            cropFailureReasonId: values.cropFailureReasonId
        };

        const updateUprootActual = async () => {
            try {
                const response = await CropService.updateUprootActualDate(harvestData)
                const toastType = response.result.success ? 'success' : 'error'
                if (response.result.success) {
                    showToast(toastType, "Uproot", response.result.successMessage);
                }
                else {
                    showToast(toastType, "Uproot", response.result.errorMessage);
                }
            } catch (error: any) {
                showToast('error', "Uproot", error.message);
            }
        };
        updateUprootActual();
        setReloadList(!reloadList);
    }

    const handleChangeUprootExpectedData = async (values: any) => {
        const harvestData = {
            plotCropId: cropCode,
            expectedDate: values.expectedDate,
        };

        const updateUprootExpected = async () => {
            try {
                const response = await CropService.updateUprootExpectedDate(harvestData);
                const toastType = response.result.success ? 'success' : 'error'
                if (response.result.success) {
                    showToast(toastType, "Uproot", response.result.successMessage);
                }
                else {
                    showToast(toastType, "Uproot", response.result.errorMessage);
                }
            } catch (error: any) {
                showToast('error', "Uproot", error.message);
            }
        };
        updateUprootExpected();
        setReloadList(!reloadList);
    }

    useEffect(() => {
        const fetchFailureReasons = async () => {
            try {
                const response = await CropService.getCropFailureReasons();
                setFailureReasons(response.result || []);
            } catch (error) {
            }
        };
        fetchFailureReasons();
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

    const getUprootExpectedDataValidation = Yup.object().shape({
        expectedDate: Yup.string().required('Expected date is required'),
    });

    const getUprootActualDataValidation = Yup.object().shape({
        actualDate: Yup.string().required('Actual date is required'),
        actualDateNotes: Yup.string().required('Notes  is required'),
        cropFailure: Yup.boolean().nullable(),
        cropFailureReasonId: Yup.string()
            .when('cropFailure', {
                is: true,
                then: schema => schema.required('Crop Failure Reason is required'),
                otherwise: schema => schema.notRequired().nullable(),
            }),
    });

    const getUprootExpectedData = () => {
        return (
            <ScrollView contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
                <Text style={styles.modalTitle}>{editUproot ? 'Edit CropHarvest' : 'Add CropHarvest'}</Text>
                <Formik
                    initialValues={{
                        plotCropId: cropDetail?.cropId || '',
                        expectedDate: editUproot?.uprootingExpectedDate || '',
                    }}
                    validationSchema={getUprootExpectedDataValidation}
                    onSubmit={(values, { resetForm }) => {
                        handleChangeUprootExpectedData(values)
                        setModalVisible(false);
                        resetForm();
                    }}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
                        <>
                            {/* <Text>{JSON.stringify(errors, null, 2)} </Text> */}

                            <DateControl
                                value={values.expectedDate}
                                setFieldValue={setFieldValue}
                                name="expectedDate"
                                error={touched.expectedDate && errors.expectedDate ? errors.expectedDate : ''}
                                touched={touched.expectedDate}
                                placeholder="Uproot Expected Date"
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
        )
    }

    const getUprootActualData = () => {
        return (
            <ScrollView contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
                <Text style={styles.modalTitle}>{editUproot ? 'Edit CropHarvest' : 'Add CropHarvest'}</Text>
                <Formik
                    initialValues={{
                        plotCropId: cropDetail?.cropId || '',
                        actualDate: editUproot?.uprootingActualDate || '',
                        actualDateNotes: editUproot?.uprootingActualDateNotes as string || '',
                        cropFailure: editUproot?.cropFailure,
                        cropFailureReasonId: editUproot?.cropFailureReasonId as string || '',
                    }}
                    validationSchema={getUprootActualDataValidation}
                    onSubmit={(values, { resetForm }) => {
                        handleChangeUprootActualData(values)
                        setModalVisible(false);
                        resetForm();
                    }}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => {
                        React.useEffect(() => {
                            if (!values.cropFailure) {
                                setFieldValue('cropFailureReasonId', '', false);
                            }
                        }, [values.cropFailure]);

                        return (
                            <>
                                {/* <Text>{JSON.stringify(errors, null, 2)} </Text> */}
                                <DateControl
                                    value={values.actualDate}
                                    setFieldValue={setFieldValue}
                                    name="actualDate"
                                    error={touched.actualDate && errors.actualDate ? errors.actualDate : ''}
                                    touched={touched.actualDate}
                                    placeholder="Harvest Actual Date"
                                    required={true}
                                />
                                <AppTextInput
                                    placeholder="Notes"
                                    onBlur={handleBlur('actualDateNotes')}
                                    value={values.actualDateNotes}
                                    required={true}
                                    error={touched.actualDateNotes && errors.actualDateNotes ? errors.actualDateNotes : ''}
                                    onChangeText={handleChange('actualDateNotes')} />
                                <View style={styles.checkboxRow}>
                                    <TouchableOpacity
                                        style={styles.checkbox}
                                        onPress={() => setFieldValue('cropFailure', !values.cropFailure)}
                                    >
                                        <MaterialCommunityIcons
                                            name={values.cropFailure ? 'checkbox-marked' : 'checkbox-blank-outline'}
                                            size={22}
                                            color="#388e3c"
                                        />
                                    </TouchableOpacity>
                                    <Text style={styles.checkboxLabel}>Crop Failed</Text>
                                </View>
                                {values.cropFailure &&
                                    <AppDropdown
                                        required={true}
                                        data={failureReasons.map((item: any) => { return { label: item.failureReason, value: item.code } })}
                                        labelField="label"
                                        valueField="value"
                                        value={values.cropFailureReasonId}
                                        error={touched.cropFailureReasonId && errors.cropFailureReasonId ? errors.cropFailureReasonId : ''}
                                        onChange={item => setFieldValue('cropFailureReasonId', item.value)}
                                        placeholder="Failure Reason"
                                    />
                                }
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
                        )
                    }}
                </Formik>
            </ScrollView>
        )
    }

    return (
        <View style={{ flex: 1, marginTop: 10 }}>
            <Card style={styles.card}>
                {cropDetail?.uprootingActualDate === null &&
                    <TouchableOpacity onPress={() => openEditModal(cropDetail, false)} style={{ justifyContent: 'flex-end', flexDirection: 'row' }}>
                        <Icon name="pencil" size={22} color="#388e3c" />
                    </TouchableOpacity>}
                <Card.Content>
                    <Text style={styles.sectionValue}><MaterialCommunityIcons name="shovel" size={18} color="#6D4C41" />  Uproot:</Text>
                    <Text style={styles.subItem}>- Expected: <Text style={styles.sectionValue}> {AppFunctions.formatDate(cropDetail?.uprootingExpectedDate)}</Text></Text>
                </Card.Content>
            </Card>
            <Card style={styles.card}>
                <TouchableOpacity onPress={() => openEditModal(cropDetail, true)} style={{ justifyContent: 'flex-end', flexDirection: 'row' }}>
                    <Icon name="pencil" size={22} color="#388e3c" />
                </TouchableOpacity>
                <Card.Content>
                    <Text style={styles.sectionValue}><MaterialCommunityIcons name="shovel" size={18} color="#6D4C41" />  Uproot:</Text>
                    <Text style={styles.subItem}>- Actual: <Text style={styles.sectionValue}> {AppFunctions.formatDate(cropDetail?.uprootingActualDate)}</Text></Text>
                    <Text style={styles.subItem}>- Notes: <Text style={styles.sectionValue}> {cropDetail?.uprootingActualDateNotes}</Text></Text>
                    <Text style={styles.subItem}>- Status:  {cropDetail?.cropFailure ? <Text style={{ color: 'red', fontWeight: 'bold' }}> Failure </Text> : <Text style={{ color: 'green', fontWeight: 'bold' }}> Success </Text>}</Text>
                    {cropDetail?.cropFailure && <Text style={styles.subItem}>- Crop Failure Reasons:<Text style={styles.sectionValue}> {cropDetail?.cropFailureReason}</Text> </Text>}
                </Card.Content>
            </Card>
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        {isActualCard ? getUprootActualData() : getUprootExpectedData()}
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    section: { fontSize: 16, marginTop: 10, },
    sectionValue: { fontSize: 16, marginTop: 10, fontWeight: 'bold' },
    subItem: { fontSize: 15, marginLeft: 20, marginVertical: 2 },
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
        marginHorizontal: 10,
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

export default CropUproot;

