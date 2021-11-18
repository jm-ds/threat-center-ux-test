import { Injectable } from "@angular/core";
import { CoreGraphQLService } from "@app/services/core/core-graphql.service";
import { BitbucketUserQuery, GitHubUserQuery, GitLabUserQuery,SnippetQuery } from "@app/models";
import gql from "graphql-tag";
@Injectable({
  providedIn: 'root'
})

export class ScanService {
  constructor(private coreGraphQLService: CoreGraphQLService) { }

  // Request github repos data from backend
  getGitHubUser() {
    return this.coreGraphQLService.coreGQLReq<GitHubUserQuery>(gql`
            query {
              gitHubUser {
                id,
                isSiteAdmin
                avatarUrl,
                email,
                location,
                name,
                company,
                url,
                login
                organizations {
                  totalCount
                  edges {
                    node {
                      ... on Organization {
                        id,
                        name,
                        avatarUrl,
                        repositories {
                            totalCount
                            edges {
                              node {
                                ... on Repository {
                                  id,
                                  name,
                                  archived,
                                  fork,
                                  private,
                                  resourcePath,
                                  sshUrl,
                                  url,
                                  primaryLanguage{
                                    color,
                                    name
                                  },
                                  defaultBranchRef {
                                    name,
                                    target {
                                      oid
                                    }
                                  }
                                  refs {
                                    edges {
                                      node {
                                        ... on Ref {
                                          id
                                          name,
                                          target {
                                            oid
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                      }
                    }
                  }
                }
                repositories {
                  totalCount
                  edges {
                    node {
                      ... on Repository {
                        id,
                        name,
                        archived,
                        fork,
                        private,
                        resourcePath,
                        sshUrl,
                        url,
                        primaryLanguage{
                          color,
                          name
                        },
                        defaultBranchRef {
                            name
                          }
                          refs {
                            edges {
                              node {
                                ... on Ref {
                                  id
                                  name
                                }
                              }
                            }
                          }
                      }
                    }
                  }
                }
              }
            }
          `, 'no-cache');
  }

  // Request gitlab repos data from backend
  getGitLabUser() {
    return this.coreGraphQLService.coreGQLReq<GitLabUserQuery>(
      gql`
              query {
                gitLabUser {
                  id,
                  avatarUrl,
                  email,
                  name,
                  username,
                  gitLabProjects {
                    id,
                    name,
                    fullPath,
                    description,
                    httpUrlToRepo,
                    sshUrlToRepo,
                    path,
                    webUrl,
                    archived,
                    createdAt,
                    repository {
                        rootRef,
                        exists
                    }
                  }
                }
              }
            `
    );
  }

  // Request bitbucket repos data from backend
  getBitbucketUser() {
    return this.coreGraphQLService.coreGQLReq<BitbucketUserQuery>(
      gql`
              query {
                bitbucketUser {
                  id,
                  name,
                  username,
                  state,
                  email,
                  avatarUrl,
                  webUrl,
                  organization,
                  bitBucketRepositories {
                      name,
                      fullName,
                      url,
                      sshUrl,
                      owner,
                      createdOn,
                      description,
                      language,
                      mainBranch,
                      branches
                  }
                }
              }
          `);
  }

  getSnippetMatches(snippetText: string, languageType: string) {
    return this.coreGraphQLService.coreGQLReq<SnippetQuery>(gql`
      query ($snippetText: String $languageType: String){
          snippetMatchResult(snippetText: $snippetText languageType: $languageType) {
            matchTime,
            scanTime,
            snippetSize,
            snippetMatches {
              matchAssetId,
              repositoryName,
              repositoryOwner,
              assetName,
              matchPercent,
              earliestRelease {
                releaseDate,
                releaseName
              },
              latestRelease {
                releaseDate,
                releaseName
              },
              earliestReleaseLicenses {
                licenseId,
                licenseName
              },
              latestReleaseLicenses {
                licenseId,
                licenseName
              },
              assetLicenses {
                licenseId,
                name
              }
            }
          }
      }
    `, 'no-cache', { snippetText: snippetText, languageType: languageType });
  }
}