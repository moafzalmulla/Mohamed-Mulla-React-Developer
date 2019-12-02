import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { graphql, Link } from 'gatsby'
import 'babel-polyfill'
import Helmet from 'react-helmet'
import get from 'lodash/get'
import Layout from '../components/layout'
import BackToTop from '../components/backToTop'

import gridStyles from '../components/grid.module.scss'
import pageStyles from './single-wp-page.module.scss'
import he from 'he'
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemPanel,
  AccordionItemButton
} from 'react-accessible-accordion';
import Contact from '../components/contact';
import faviconIco from './../../static/favicon.ico';
import faviconPng from './../../static/favicon.png';
import readingTime from 'reading-time';

import SiteWideMsg from '../components/siteWideMsg'
import AlphaMsg from '../components/alphaMsg'
import BetaMsg from '../components/betaMsg'
import Breadcrumb from '../components/breadcrumb'


let tables
let list,
readwords,
inPageNav,
indexo;

class SinglePageTemplate extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			theposition: 0,
			wppage: get(this.props, 'data.wordpressPage'),
			wpservices: get(this.props, 'data.wordpressWpService'),
			mymenu: this.props,
			wppages: get(this, 'props.data.allWordpressPage.edges'),
			wpbreadcrumb: get(this, 'props.data.allWordpressWpService.edges'),
		};
	}
	componentDidMount() {
		let tables = document.getElementsByTagName('table');
		for (var i = 0, len = tables.length; i < len; i++) {
			var table = tables[i];
				// create wrapper container
				var wrapper = document.createElement('span');
				// append id to span
				wrapper.setAttribute('class','lbhtable')
				// insert wrapper before el in the DOM tree
				table.parentNode.insertBefore(wrapper, table);
				// move el into wrapper
				wrapper.appendChild(table);
				//log change
				// console.log("table no. " + tables[i] + " was wrapped");
		}
		var element = this.content;
		var textbody = element.innerText || element.textContent;
		var readtime = readingTime(textbody)
		var readTimeNumber = readtime.text.toString();
		var readTimeVal = readTimeNumber.charAt(0)
		this.setState({
			readtime: readtime,
			readTimeVal: readTimeVal
		})
	}

  render(data, location, readtime) {
    const wppage = get(this.props, 'data.wordpressPage')
    const wpservice = get(this.props, 'data.wordpressWpService')
    const wpcontact = get(this.props, 'data.wordpressWpContact')
    const siteSettings = get(this.props, 'data.contentfulSiteSettings')
    const siteOptions = get(this.props, 'data.wordpressAcfOptions')
	const siteMetadata = get(this.props, 'data.site.siteMetadata')
    return (
		<Layout>
			{siteOptions.options.show_alpha_message.value == "yes" ?  <AlphaMsg  /> : ""}
			{siteOptions.options.show_beta_message.value == "yes" ?  <BetaMsg  /> : ""}
			{siteOptions.options.show_sitewide_msg.value == "yes" ?  <SiteWideMsg  /> : ""}
			{
				siteOptions.options.sectionwide_announcements.map((swa, i)=>{
					return(
							swa.sections.map((sec,index)=>{
								return(
										sec == wppage.service ? 
											
												<div key={index} className={pageStyles.sectionWideAnnouncements}>
													<div className={gridStyles.lbhRow}>
														<div className={gridStyles.lbhContainer} dangerouslySetInnerHTML={{ __html: swa.announcement  }}/>
													</div>
												</div>

										: 
										""
										
								)
							})
					)
				})
			}
			<BackToTop />
			<div className={gridStyles.lbhContainer}>
				<div className={gridStyles.lbhRow} id="top">
					<div className={gridStyles.lbhColumnFull}>
						<Helmet>
							<link rel="icon" src={faviconIco} type="image/x-icon" />
							<link rel="shortcut icon" href={faviconPng} type="image/x-icon"/>
							<title>
								{`${he.decode(wppage.title)} | ${siteMetadata.title}`} 
							</title>
						</Helmet>
					<div className={pageStyles.singlePage} >
						
						<Breadcrumb 
							crumbs={this.state.wpservices} 	
							current_page_title={this.state.mymenu.data.wordpressPage.title}
							current_page_url={this.state.mymenu.location.href}
						/>

						{wppage.title ? <h1 dangerouslySetInnerHTML={{ __html: wppage.title  }}/> : "Untitled"}
						
						{this.state.readTimeVal <= 1 ? 
							"" 
							: 
							(
							this.state.readtime  == null || undefined ? "" : <div className={pageStyles.readingTime}>{this.state.readtime.text}</div>
							)
						}
							<div className={pageStyles.pageContent} ref={el => {this.content = el;}} >
								{
									wppage.acf.lbh_page_builder_page.map((acf_field, i )=> {
										if(acf_field.__typename == "WordPressAcf_content"){
											return( 
												<div
												key={i}
												className={pageStyles.wpContent}
												dangerouslySetInnerHTML={{ __html: acf_field.content }}
												/>
											) 
										}else if(acf_field.__typename == "WordPressAcf_accordion"){
											return( 
												<div key={i} className={pageStyles.wpAccordions} >
													<Accordion  className={pageStyles.accordion} allowZeroExpanded={true} allowMultipleExpanded={true}>
														{
															acf_field.accordions.map((acc_field, index )=> {
																return(
																<AccordionItem key={index} className={pageStyles.accordionItem} >
																	<AccordionItemHeading className={pageStyles.accordionItemHeading}>
																		<AccordionItemButton className={pageStyles.accordionItemButton}>
																			{acc_field.accordion_title}
																		</AccordionItemButton>
																	</AccordionItemHeading>
																	<AccordionItemPanel className={pageStyles.accordionItemPanel}>
																	<div
																		
																		dangerouslySetInnerHTML={{ __html: acc_field.accordion_content }}
																		/>
																	</AccordionItemPanel>
																</AccordionItem>
																)
															})
														}
													</Accordion>
												</div>
											) 
										}else if(acf_field.__typename == "WordPressAcf_featured_message"){
											return( 
												<div
												key={i}
												className={pageStyles.wpFeaturedMsg}
												dangerouslySetInnerHTML={{ __html: acf_field.featured_message }}
												/>
											) 
										}else if(acf_field.__typename == "WordPressAcf_anchor_links"){
											return( 
												<div key={i} className={pageStyles.wpAnchorLinks}>
													<h5>On this page:</h5>
													<ul>
														{
															acf_field.anchor_links.map((anchor, index )=> {
																return(
																	<li key={index}>
																		<a href={anchor.anchor_link}>{anchor.anchor_title}</a>
																	</li>
																)
															})
														}
													</ul>
												</div>
											) 
										}
										else if(acf_field.__typename == "WordPressAcf_iframes"){
											return( 
												<div
												id={'lbhiframe'}
												className={pageStyles.wpIframes}
												dangerouslySetInnerHTML={{ __html: acf_field.iframe }}
												/>
											)
										}
										else if(acf_field.__typename == "WordPressAcf_image_block_single"){
											return( 
												<div className={pageStyles.imageBlockContainer}>
													<div  className={pageStyles.wpSingleImage} style={{ backgroundImage: `url(${ acf_field.image_one.source_url})`}}>
														<span>{he.decode(acf_field.image_one.title)}</span>
													</div>
												</div>
											)
										}
										else if(acf_field.__typename == "WordPressAcf_image_block_double"){
											return( 
												<div className={pageStyles.imageBlockContainer}>
													<div  className={pageStyles.wpDoubleImageLeft} style={{ backgroundImage: `url(${ acf_field.image_one.source_url})`}}>
														<span>{he.decode(acf_field.image_one.title) }</span>														
														
													</div>
													<div  className={pageStyles.wpDoubleImageRight} style={{ backgroundImage: `url(${ acf_field.image_two.source_url})`}}>
														<span>{he.decode(acf_field.image_two.title)}</span>
													</div>
												</div>
											)
										}
										else if(acf_field.__typename == "WordPressAcf_image_block_triple"){
											return( 
												<div className={pageStyles.imageBlockContainer}>
													<div  className={pageStyles.wpTripleImageLeft} style={{ backgroundImage: `url(${ acf_field.image_one.source_url})`}}>
														<span>{acf_field.image_one.title}</span>
													</div>
													<div  className={pageStyles.wpTripleImageMiddle} style={{ backgroundImage: `url(${ acf_field.image_two.source_url})`}}>
														<span>{acf_field.image_two.title}</span>
													</div>
													<div  className={pageStyles.wpTripleImageRight} style={{ backgroundImage: `url(${ acf_field.image_three.source_url})`}}>
														<span>{acf_field.image_three.title}</span>
													</div>
												</div>
											)
										}
										else{
											return( ""  ) 
										}
									})
								}
								{
									wppage.date ?  
										<div className={pageStyles.pageUpdated} >Page updated on: {wppage.date} <br></br></div> 
									: 
										""
								}
							</div>
					</div>
				</div>
			</div>
			<Contact 
			title={wpcontact.title}
			slug={wpcontact.slug}
			uprn={wpcontact.acf.uprn}
			cbid={wpcontact.wordpress_id}
			address_line_1={wpcontact.acf.address_line_1}
			address_line_2={wpcontact.acf.address_line_2}
			address_line_3={wpcontact.acf.address_line_3}
			postcode={wpcontact.acf.postcode}
			telephone={wpcontact.acf.telephone}
			email={wpcontact.acf.email}
			opening_times={wpcontact.acf.opening_times}
			notes={wpcontact.acf.notes}
			uprn={wpcontact.acf.uprn}
			contact_social={wpcontact.acf.contact_social}
			location={this.props.location}
			/>
		  </div>
      </Layout>
    )
  }
}

export default SinglePageTemplate

export const pageQuery = graphql`

  query (
    $slug: String!
    $wordpress_id: Int!
    $contact: Int!
    ){
        site {
          siteMetadata {
            title
            # pageStatus
          }
        }
        
    wordpressPage(slug: { eq: $slug }) {
      title
      slug
      date(formatString: "D MMMM YYYY")
      status
      content
      service
      acf{
        lbh_page_builder_page{
		__typename 
			... on WordPressAcf_content {
				content
			}
			... on WordPressAcf_featured_message{
				featured_message
			}
			... on WordPressAcf_accordion{
				accordions {
					accordion_title
					accordion_content
				}
			}
			... on WordPressAcf_anchor_links{
				anchor_links{
					anchor_title
					anchor_link
				}
			}
			... on WordPressAcf_iframes{
				iframe
			}
			... on WordPressAcf_image_block_single{
				image_one{
					source_url
					title
				}
			}
			... on WordPressAcf_image_block_double{
				image_one{
					source_url
					title
				}
				image_two{
					source_url
					title
				}
			}
			... on WordPressAcf_image_block_triple{
				image_one{
					source_url
					title
				}
				image_two{
					source_url
					title
				}
				image_three{
					source_url
					title
				}
			}
        }
        contact
      }
    }

    wordpressWpContact(wordpress_id: {eq: $contact}){
		id
		wordpress_id
		title
		slug
		acf{
		address_line_1
		address_line_2
		address_line_3
		postcode
		telephone {
			telephone_label
			telephone_number
		}
		email {
			email_label
			email_address
		}
		opening_times {
			opening_time
		}
		contact_social{
			social_network
			link_to_page
		}
		notes
		uprn
		}
  	}

    wordpressWpService(wordpress_id: {eq: $wordpress_id}){
      name
      wordpress_parent
      count
      slug
      path
      description
      wordpress_id
      taxonomy{
        name
      }
      parent_element{
        name
        slug
		path
        count
        wordpress_parent
        parent_element{
          name
          slug
		  path
          count
          wordpress_parent
        }
      }
    }

	wordpressAcfOptions{
			options{
				sectionwide_announcements{
					announcement
					sections
				}
				show_sitewide_msg{
					value
					label
				}
				show_alpha_message{
					value
					label
				}
				show_beta_message{
					value
					label
				}
			}
		}

	allWordpressWpService{
		edges{
			node{
				id
				wordpress_id
				name
				wordpress_parent
				count
				slug
				path
				description
				order
				show_or_hide_from_menu
				redirect_service
				redirect_url
				taxonomy{
					name
					slug
				}
				parent_element{
					wordpress_id
					name
					count
					slug
					path
					wordpress_parent
					parent_element{
						wordpress_id
						name
						count
						slug
						path
						wordpress_parent
					}
				}
			}
		}
    }
	allWordpressPage {
		edges {
			node {
			id
			wordpress_id
			wordpress_parent
			slug
			title
			service
			content
			excerpt
			date
			modified
			type
			acf{
				order
				show_or_hide_from_menu
				redirect_page
				redirect_url
			}
			}
		}
	}
    contentfulSiteSettings(slug: { eq: "site-settings" }) {
      footerSocial{
        text
        url
        icon
      }
    }
  }
`
