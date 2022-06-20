import styles from '../scss/Info.module.scss'
import {Card, Button, Container, Row, Col, Form} from 'react-bootstrap'
import { useEffect, useState } from 'react'
import { $axios } from '../utils/axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

function Info () {
    const navigate = useNavigate()
    const API_URL = process.env.REACT_APP_API_URL
    const token = localStorage.getItem('token')

    const [userName, setUserName] = useState('')
    const [userEmail, setUserEmail] = useState('')
    const [newPassword, setNewPassword] = useState("")

    const [defaultImg, setDefaultImg] = useState('');
    const [newImg, setNewImg] = useState('');
    const [avatarImg, setAvatarImg] = useState(null);

    const inputChange = (e) => {
        const {target: {name, value}} = e
        switch (name) {
            case 'name':
                setUserName(value)
                break
            case 'new-password':
                setNewPassword(value)
                break
            default:
        }
    }
    const uploadAvatar = (e) => {
        const file = e.target.files[0];
    
        setNewImg(URL.createObjectURL(file))
        setAvatarImg(file)
        setDefaultImg('')
    }
    const getForm = () => {
        const form = new FormData()
        form.append('name', userName)
        form.append('avatar_img', avatarImg)
        form.append('password', newPassword)
        return form
    }

    const editInfo = (e) => {
        e.preventDefault()
        const form = getForm()
        const config = {
            headers: {
                'Content_Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            }
        }
        const updateUser = $axios.post(`${API_URL}/api/v1/user_information`, form, config)
        updateUser.then(res => {
            const {data: {data, message}} = res
            localStorage.removeItem('userData')
            const parsedUserData = JSON.stringify(data)
            localStorage.setItem('userData', parsedUserData)
            toast.success(message)
            navigate('/')
            
        }).catch(err => {
            toast.error(err)
        })
        
    }
    useEffect(() => {
        // setHeadersToken(token)
        const fetchUserInfo = $axios.get(`${API_URL}/api/v1/user_information`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        fetchUserInfo.then(res => {
            const {data: {data}} = res
            setUserName(data.name)
            setUserEmail(data.email)
            setDefaultImg(data.avatar_img)
            console.log(data.avatar_img);
        })
    }, [])
    return (
        <>
         <Container className={styles.infoContainer}>
            <Row>
                <Col>
                    <h1>마이페이지</h1>
                    <Container className="px-2">
                        <Row>
                            <Col as="form" onSubmit={editInfo} className={styles.infoContainerForm}>
                                <Form.Group controlId="formFile" className={`${styles.avatarFileGroup} mb-3`}>
                                    <Form.Label>
                                    {
                                        defaultImg ? <div className={styles.avatarPreview}><img src={
                                            `${process.env.REACT_APP_API_URL}${defaultImg}`
                                        }/></div>
                                        : newImg ? <div className={styles.avatarPreview}><img src={
                                            `${newImg}`
                                        }/></div> :
                                        <div className={styles.avatarPreview}/> 
                                    }
                                    </Form.Label>
                                    <Form.Control type="file" className={styles.avatarInput} onChange={uploadAvatar} />
                                </Form.Group>
                                <div>
                                    <label htmlFor="name-input">이름</label>
                                    <input name="name" id="name-input" type="text" placeholder="이름" value={userName} onChange={inputChange}/>
                                    <label htmlFor="email-input" className={'mt-3'}>이메일</label>
                                    <input id="email-input" type="text" placeholder="이메일" value={userEmail} readOnly/>
                                    <label htmlFor="new-password-input" className={'mt-3'}>새로운 비밀번호</label>
                                    <input name="new-password" id="new-password-input" type="password" placeholder="이름" value={newPassword} onChange={inputChange}/>
                                    <Button className={styles.editBtn} type="submit">정보 수정</Button>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </Col>
            </Row>
         </Container>
        </>
    )
}

export default Info