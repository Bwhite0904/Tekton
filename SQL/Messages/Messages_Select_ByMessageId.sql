USE [Flow]
GO
/****** Object:  StoredProcedure [dbo].[Messages_Select_ByMessageId]    Script Date: 9/23/2022 8:41:25 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author: Brandon White
-- Create date: 7/30/2022
-- Description: Selects a message by Id.
-- Code Reviewer: 

-- MODIFIED BY: 
-- MODIFIED DATE:
-- Code Reviewer:
-- Note:
-- =============================================


ALTER proc [dbo].[Messages_Select_ByMessageId]
										@MessageId int

as

/*
---------------Test Code-------------------
Declare @MessageId int = 63

Execute dbo.Messages_Select_ByMessageId 
										@MessageId
										
---------------Test Code-------------------
*/

Begin


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
		  FROM dbo.Messages AS m
		  inner join dbo.UserProfiles as p on p.UserId = m.SenderId 
		  inner join dbo.UserProfiles as up on up.userId = m.RecipientId
		  WHERE (m.Id = @MessageId)

End





