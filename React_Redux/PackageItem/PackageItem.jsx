import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import IconButton from '@material-ui/core/IconButton';
import { ReactComponent as PersonIcon} from '../../assets/icons/person.svg';
import { ReactComponent as EditIcon} from '../../assets/icons/edit.svg';

const PackageContainer = styled.div`
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    background: transparent;
`;
const PackageRow = styled.div`
    width: 100%;
    height: 64px;
    border-radius: 4px;
    margin-bottom: 15px;

    display: flex;
    flex-wrap: wrap;
    flex-direction: row;

    background-color: #f6f9f8;
    color: #3d4745;

`;
const PackageColumnTen = styled.div`
    width: 10%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: left;
`;
const PackageColumnThirty = styled.div`
    width: 30%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: left;
`;
const PackageImages = styled.div`
    width: 64.8px;
    height: 37px;
    border-radius: 2px;
    background-size: cover;
    background-position: center;
    margin: 6px;
`;
const EditIconAccent = styled(EditIcon)`
    fill: ${({ theme }) => theme.colors.ACCENT};
`;

const PackageItem = ({
    packageGuid,
    packageTitle,
    packageAgent,
    packageDate,
    packageImages,
}) => (

    <PackageContainer>
        <PackageRow>
            <PackageColumnThirty>
                <div style={{ padding: '20px 25px', fontSize: '17px' }}>{packageTitle}</div>
            </PackageColumnThirty>
                        <PackageColumnThirty style={{ fontSize: '14px' }}>
                        <PersonIcon/>
                        {packageAgent}
                        {" "}
                        {packageDate}
                        </PackageColumnThirty>
            <PackageColumnThirty>
                {packageImages.map(packageImage => <PackageImages style={{ backgroundImage: `url(${packageImage.image})` }} />)} 
                    {' '}
                <PackageImages style={{ paddingTop: '18px', fontSize: '14px'}}>22 more</PackageImages>
            </PackageColumnThirty>
            <PackageColumnTen>
                <IconButton
                    classes={{ root: 'Trip-List-Item-Menu-Edit-Icon' }}
                >
                    <EditIconAccent />
                </IconButton>
            </PackageColumnTen>
        </PackageRow>
    </PackageContainer>
);

PackageItem.propTypes = {
    package: PropTypes.shape({
        packageGuid: PropTypes.string,
        packageTitle: PropTypes.string,
        packageAgent: PropTypes.string,
        packageDate: PropTypes.string,
        packageSlides: PropTypes.arrayOf(PropTypes.object),
    }).isRequired,
};

PackageItem.defaultProps = {
    packageGuid: 'abc-123',
    packageTitle: 'Sample Package',
    packageAgent: 'Mo Mulla',
    packageDate: '22 Oct 19 10:22am',
    packageImages: [
        { image: 'https://cdn.pixabay.com/photo/2019/11/19/22/25/giraffe-4638681_960_720.jpg' },
       	{ image: 'https://cdn.pixabay.com/photo/2019/09/16/19/52/beach-4481919_960_720.jpg' },
        { image: 'https://cdn.pixabay.com/photo/2019/11/19/12/02/tree-4637270_960_720.jpg' },
    ],
};

export default PackageItem;
