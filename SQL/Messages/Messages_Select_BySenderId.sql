USE [Flow]
GO
/****** Object:  StoredProcedure [dbo].[Messages_Select_BySenderId]    Script Date: 9/23/2022 8:42:10 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author: Brandon White
-- Create date: 7/30/2022
-- Description: Selects messages paginated by sender Id.
-- Code Reviewer: 

-- MODIFIED BY: 
-- MODIFIED DATE:
-- Code Reviewer:
-- Note:
-- =============================================


ALTER proc [dbo].[Messages_Select_BySenderId]
										@Id int
										,@PageIndex int
										,@PageSize int

as

/*
---------------Test Code-------------------
Declare @Id int = 4
		,@PageIndex int = 0
		,@PageSize int = 4

Execute dbo.Messages_Select_BySenderId 
								@Id
								,@PageIndex
								,@PageSize
---------------Test Code-------------------
*/

Begin
Declare @Offset int = @PageIndex * @PageSize

		SELECT m.Id
			  ,m.Message
			  ,m.Subject
			  ,m.RecipientId
			  ,m.SenderId
			  ,m.DateSent
			  ,m.DateRead
			  ,m.DateModified
			  ,m.DateCreated
			  ,p.FirstName as SenderFirstName
			  ,p.LastName as SenderLastName
			  ,p.AvatarUrl as SenderAvatarUrl
			  ,up.FirstName as RecipientFirstName
			  ,up.LastName as RecipientLastName
			  ,up.AvatarUrl as RecipientAvatarUrl
			  ,TotalCount = COUNT(1) OVER()
		  FROM dbo.Messages AS m inner join dbo.UserProfiles as p
		  on p.UserId = m.SenderId inner join dbo.UserProfiles as up
		  on up.userId = m.RecipientId
		  WHERE m.SenderId = @Id		  
		  ORDER BY m.Id DESC

		  OFFSET @Offset Rows
		  Fetch Next @PageSize Rows ONLY

End





