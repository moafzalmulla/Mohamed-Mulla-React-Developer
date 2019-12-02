// Construct path and promise
const Promise = require('bluebird')
const path = require('path')
// import get from 'lodash/get'

var fs = require('fs');
var uglify = require('uglify-js');
var lunr = require('lunr');


const axios = require("axios")


require("dotenv").config({
	path: `.env`,
  })
// import lunr from "lunr";


// fs.writeFile(
// 	'static/redirects.txt', 
// 	'Redirects file was created!', 
// 	function (err) {
// 		if (err) throw err;
// 		console.log('Saved!');
//   	}
// );
// start

// end
// Initlialise createPages API
	exports.createPages = ({ graphql, actions }) => {
		const { createPage } = actions

		return new Promise( (resolve, reject) => {

			// Set corresponding single view templates
			const singleWpPage = path.resolve('./src/templates/single-wp-page.js')
			const singleWpPageNoContact = path.resolve('./src/templates/single-wp-page-no-contact.js')
			const singleWpMenuServiceZero = path.resolve('./src/templates/menu-template-level-zero.js')
			const singleWpMenuServiceOne = path.resolve('./src/templates/menu-template-level-one.js')
			const singleWpMenuServiceTwo = path.resolve('./src/templates/menu-template-level-two.js')
			const singleWpMenuServiceThree = path.resolve('./src/templates/menu-template-level-three.js')


			
			axios
			.get(process.env.REST_API_SEARCH)
			.then(result => {
				const { data } = result
				/**
				 * creates a dynamic page with the data received
				 * injects the data into the context object alongside with some options
				 * to configure js-search
				 */
			
				resolve(
				
					graphql(
						`{   
							site {
								siteMetadata {
								title
								contact
								}
							}
							allWordpressPage {
								edges {
									node {
										id
										slug
										service
										title
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
											contact
										}
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
											wordpress_parent
											parent_element{
												wordpress_id
												name
												count
												slug
												wordpress_parent
											}
										}
									}
								}
							}
							wordpressAcfOptions{
								options{
									redirects {
										from
										to
										external_url
									}
									search_page_links{
										text
										url
									}
								}
							}
							allWordpressWpSearch {
								edges {
									node {
									id
									post_title
									searchData
									pathname
									}
								}
							}
						}`
					)
					.then(result => {
						// Log any errors
						if (result.errors) {
							console.log(result.errors)
							reject(result.errors)
						}
	
						// const pages = result.data.allContentfulPage.edges
						const wppages = result.data.allWordpressPage.edges
						const wpservices = result.data.allWordpressWpService.edges
						const wpsearch = result.data.allWordpressWpSearch.edges
						const wpoptions = result.data.wordpressAcfOptions
						const wpoptionlinks = result.data.wordpressAcfOptions
						const pas = result.data.allWordpressWpService.edges.concat(result.data.allWordpressPage.edges)
						// Write a list to a file
						// console.log("The Pages Yo: " + JSON.stringify(wppages))
						// console.log("The Options Yo: " + JSON.stringify(wpoptions))
	
						// This code uses file system to write the redirects to a file programmatically from the cms
						require("fs").writeFile(
							'static/_redirects',
							wpoptions.options.redirects.map(
								(v,i)=>{ return (v.from + " " + v.to) }
							)
							.join('\n') + `\n` + `https://lbh-2019.netlify.com/* https://hackney.gov.uk/:splat 301!`,
							console.log("Redirects were generated ..."),
							//if theres and error
							function (err) { console.log(err ? 'Error :'+err : 'ok') }
						)	
						// Create search page and pass props for index
						createPage({
							path: "/search",
							component: path.resolve(`./src/templates/ClientSearchTemplate.js`),
							context: {
								bookData: {
										allBooks: data,
										searchoptions: {
											indexStrategy: "Prefix match",
											searchSanitizer: "Lower Case",
											PostTitleIndex: true,
											SearchDataIndex: true,
											SearchByTerm: true,
										},
										optionlinks: wpoptionlinks
								},
							},
						})
						// Create pages for every service unde /browse
						// Nest loop thorugh all services to create various levels
						// /page
						
						// /browse/level1/level2/level3/page
							// wpservices.forEach((wpservice, index) => {
							// 		wpservice.node.parent_element.parent_element.wordpress_parent >= 1 ?
							// 		(
							// 			createPage({
							// 				path: `/browse/${wpservice.node.parent_element.parent_element.slug}/`,
							// 				component: singleWpMenuService,
							// 				context: {
							// 					wordpress_service: wpservice,
							// 					service_one_a: wpservice.node.wordpress_id,
							// 					service_two_a: "none",
							// 					service_three_a: "none"
							// 				},
							// 			}),
											
							// 		):""
							// })

						// console.log("Option links resolved for search...")
						// build site static pages prgramatically
						wppages.forEach((wppage, index) => {
							// console.log(" the page name: " + wppage.node.title + " wordpresss_id: " + wppage.node.service[0]);
							// console.log(" the contact block value: " + wppage.node.title + ") " + wppage.node.acf.contact[0]);
										
							//Logic: If no contact block set, set address to Dummy address as default 
							// If Dummy address hide contact block in single template
							if(wppage.node.acf.contact !== null){
								createPage({
									path: `/${wppage.node.slug}`,
									component: singleWpPage,
									context: {
									slug: wppage.node.slug,
									wordpress_id: wppage.node.service[0],
									contact: wppage.node.acf.contact[0],
									},
								})
							}else{
								createPage({
									path: `/${wppage.node.slug}`,
									component: singleWpPageNoContact,
									context: {
									slug: wppage.node.slug,
									wordpress_id: wppage.node.service[0],
									},
								})
							}
						})
						createPage({
							path: "/service",
							component: singleWpMenuServiceZero,
							context: {
								service_zero: 0,			
								service_one: null,
								service_two: null,
								service_three: null,
								pas: pas
							},
						})
						console.log("New nav started building...");
						console.log("Initialising ...../service/ was created");
						wpservices.forEach((wpservice, index) => {
							// console.log(
							// "1)" + wpservice.node.service[0] +
							// "2)" + wpservice.node.wordpress_parent +
							// "3)" + wpservice.node.parent_element.wordpress_parent
							// )

							// /browse/level1/page
							if(wpservice.node.wordpress_parent === 0){
								createPage({
									path: `/${wpservice.node.path}`,
									component: singleWpMenuServiceOne,
									context: {
										service_zero: 0,			
										service_one: wpservice.node.wordpress_id,
										service_two: null,
										service_three: null,
										pas: pas
										// service_one: wpservice.node.wordpress_id,
										// service_two: "none",
										// service_three: "none"
									},
								})
							}

							// /browse/level1/level2/page
							// traverse to right level parent element
							if(wpservice.node.parent_element == null){
							}else{
								createPage({
									path: `${wpservice.node.path}`,
									component: singleWpMenuServiceTwo,
									context: {
										service_zero: 0,			
										service_one: wpservice.node.wordpress_id,
										service_two: wpservice.node.parent_element.wordpress_id,
										service_three: null,
										pas: pas
										// service_one: wpservice.node.parent_element.wordpress_id,
										// service_twe: wpservice.node.wordpress_id,
										// service_three: "none"
									},
								})
								//when we get to level check again for null
								if(wpservice.node.parent_element.parent_element == null){
									//if its not null
								}else{
									// if not null then create level 2 service menu pages
									createPage({
										path: `${wpservice.node.path}`,
										component: singleWpMenuServiceThree,
										context: {
											service_zero: 0,			
											service_one: wpservice.node.wordpress_id,
											service_two: wpservice.node.parent_element.wordpress_id,
											service_three: wpservice.node.parent_element.parent_element.wordpress_id,
											pas: pas
											// service_one: wpservice.node.parent_element.parent_element.wordpress_id,
											// service_two: wpservice.node.parent_element.wordpress_id,
											// service_three: wpservice.node.wordpress_id,
										},
									})
									
								}
								
							}

						})

						console.log("1) level 1 menu items were created");
						console.log("2) level 2 menu items were created");
						console.log("3) level 3 menu items were created");
						console.log("Awesome! The new navigation was created at /service");
						// console.log("PS. if build fails saying Javascript heap out of memory, run : export NODE_OPTIONS=--max_old_space_size=4096")
						// See more notes on configuring netlify node memory options as env variable: https://github.com/gatsbyjs/gatsby/issues/15190
					}) //ends then
	
					) //ends resolve
	
				}) //ends promise
				console.log("NEW SEARCH SORTED")
			})
			.catch(err => {
				console.log("====================================")
				console.log(`error creating Page:${err}`)
				console.log("====================================")
				// reject(new Error(`error on page creation:\n${err}`))
			})


	}     

					